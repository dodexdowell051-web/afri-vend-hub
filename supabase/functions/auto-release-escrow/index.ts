import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AUTO_RELEASE_DAYS = 7;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Find orders that are shipped/delivered, paid, and past the 7-day window
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - AUTO_RELEASE_DAYS);
    const cutoffISO = cutoffDate.toISOString();

    // Get orders where status is shipped or delivered, payment is paid,
    // and the delivered_at or updated_at is older than 7 days
    const { data: eligibleOrders, error: fetchError } = await supabase
      .from("orders")
      .select(`
        id, status, payment_status, buyer_id, store_id, 
        total, platform_commission, seller_earning,
        delivered_at, updated_at
      `)
      .in("status", ["shipped", "delivered"])
      .eq("payment_status", "paid")
      .or(`delivered_at.lte.${cutoffISO},and(delivered_at.is.null,updated_at.lte.${cutoffISO})`);

    if (fetchError) {
      throw new Error(`Failed to fetch eligible orders: ${fetchError.message}`);
    }

    console.log(`Found ${eligibleOrders?.length || 0} orders eligible for auto-release`);

    const results: { orderId: string; success: boolean; error?: string }[] = [];

    for (const order of eligibleOrders || []) {
      try {
        // Check for open disputes
        const { data: dispute } = await supabase
          .from("disputes")
          .select("id")
          .eq("order_id", order.id)
          .in("status", ["pending", "under_review"])
          .maybeSingle();

        if (dispute) {
          console.log(`Skipping order ${order.id} - has open dispute`);
          results.push({ orderId: order.id, success: false, error: "Open dispute" });
          continue;
        }

        // Get store to find seller
        const { data: store } = await supabase
          .from("stores")
          .select("user_id")
          .eq("id", order.store_id)
          .single();

        if (!store) {
          results.push({ orderId: order.id, success: false, error: "Store not found" });
          continue;
        }

        const sellerId = store.user_id;
        const sellerEarning = order.seller_earning || 0;
        const platformCommission = order.platform_commission || 0;
        const now = new Date().toISOString();

        // Get or create seller wallet
        let { data: wallet } = await supabase
          .from("seller_wallets")
          .select("id, balance, total_earnings")
          .eq("user_id", sellerId)
          .single();

        if (!wallet) {
          const { data: newWallet, error: createErr } = await supabase
            .from("seller_wallets")
            .insert({ user_id: sellerId, balance: 0, total_earnings: 0 })
            .select()
            .single();
          if (createErr) {
            results.push({ orderId: order.id, success: false, error: "Failed to create wallet" });
            continue;
          }
          wallet = newWallet;
        }

        // Update wallet balance
        const newBalance = (wallet.balance || 0) + sellerEarning;
        const newTotalEarnings = (wallet.total_earnings || 0) + sellerEarning;

        await supabase
          .from("seller_wallets")
          .update({ balance: newBalance, total_earnings: newTotalEarnings, updated_at: now })
          .eq("id", wallet.id);

        // Record wallet transaction
        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          order_id: order.id,
          amount: sellerEarning,
          type: "credit",
          status: "completed",
          description: `Auto-release: 7-day window expired for order #${order.id.slice(0, 8).toUpperCase()}`,
        });

        // Record financial transaction
        await supabase.from("financial_transactions").insert({
          user_id: sellerId,
          wallet_id: wallet.id,
          order_id: order.id,
          amount: sellerEarning,
          type: "auto_release",
          description: `Auto-release after ${AUTO_RELEASE_DAYS} days - order #${order.id.slice(0, 8).toUpperCase()}`,
          metadata: {
            buyer_id: order.buyer_id,
            platform_commission: platformCommission,
            order_total: order.total,
            auto_released_at: now,
            release_reason: "7_day_window_expired"
          }
        });

        // Platform commission transaction
        await supabase.from("financial_transactions").insert({
          order_id: order.id,
          amount: platformCommission,
          type: "commission",
          description: `Platform commission (auto-release) from order #${order.id.slice(0, 8).toUpperCase()}`,
          metadata: { seller_id: sellerId, buyer_id: order.buyer_id, order_total: order.total }
        });

        // Update platform balance
        const { data: platformBalance } = await supabase
          .from("platform_balance")
          .select("*")
          .maybeSingle();

        if (platformBalance) {
          await supabase
            .from("platform_balance")
            .update({
              total_revenue: platformBalance.total_revenue + order.total,
              total_commissions: platformBalance.total_commissions + platformCommission,
              updated_at: now
            })
            .eq("id", platformBalance.id);
        } else {
          await supabase.from("platform_balance").insert({
            total_revenue: order.total,
            total_commissions: platformCommission,
            pending_payouts: 0,
            completed_payouts: 0
          });
        }

        // Update order status
        await supabase
          .from("orders")
          .update({ status: "completed", delivered_at: order.delivered_at || now, updated_at: now })
          .eq("id", order.id);

        // Audit log
        await supabase.rpc("create_audit_log", {
          p_action_type: "auto_escrow_release",
          p_entity_type: "order",
          p_entity_id: order.id,
          p_details: {
            buyer_id: order.buyer_id,
            seller_id: sellerId,
            seller_earning: sellerEarning,
            platform_commission: platformCommission,
            days_elapsed: AUTO_RELEASE_DAYS,
            new_wallet_balance: newBalance
          }
        });

        console.log(`Auto-released escrow for order ${order.id}`);
        results.push({ orderId: order.id, success: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error(`Failed to auto-release order ${order.id}:`, msg);
        results.push({ orderId: order.id, success: false, error: msg });
      }
    }

    const successCount = results.filter(r => r.success).length;
    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${results.length} orders, ${successCount} released successfully`,
      results,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Auto-release escrow error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
