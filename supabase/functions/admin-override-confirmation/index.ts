import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminOverrideRequest {
  orderId: string;
  action: "confirm" | "reverse";
  reason: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { orderId, action, reason }: AdminOverrideRequest = await req.json();
    console.log("Admin override request:", { orderId, action, reason });

    if (!orderId || !action || !reason) {
      throw new Error("Missing required fields: orderId, action, reason");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the requesting user is an admin
    const anonClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Check admin role
    const { data: adminRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !adminRole) {
      throw new Error("Unauthorized - Admin access required");
    }

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    const now = new Date().toISOString();

    if (action === "confirm") {
      // Admin confirming delivery on behalf of buyer
      if (order.status === "completed") {
        throw new Error("Order already completed");
      }

      // Get store and seller
      const { data: store } = await supabase
        .from("stores")
        .select("user_id")
        .eq("id", order.store_id)
        .single();

      if (!store) {
        throw new Error("Store not found");
      }

      const sellerId = store.user_id;
      const sellerEarning = order.seller_earning || 0;

      // Get or create seller wallet
      let { data: wallet } = await supabase
        .from("seller_wallets")
        .select("id, balance, total_earnings")
        .eq("user_id", sellerId)
        .single();

      if (!wallet) {
        const { data: newWallet, error: createError } = await supabase
          .from("seller_wallets")
          .insert({ user_id: sellerId, balance: 0, total_earnings: 0 })
          .select()
          .single();
        if (createError) throw new Error("Failed to create wallet");
        wallet = newWallet;
      }

      // Update wallet
      await supabase
        .from("seller_wallets")
        .update({
          balance: (wallet.balance || 0) + sellerEarning,
          total_earnings: (wallet.total_earnings || 0) + sellerEarning,
          updated_at: now,
        })
        .eq("id", wallet.id);

      // Record transactions
      await supabase.from("wallet_transactions").insert({
        wallet_id: wallet.id,
        order_id: orderId,
        amount: sellerEarning,
        type: "credit",
        status: "completed",
        description: `Admin override: Escrow release for order #${orderId.slice(0, 8).toUpperCase()}`,
      });

      await supabase.from("financial_transactions").insert({
        user_id: sellerId,
        wallet_id: wallet.id,
        order_id: orderId,
        amount: sellerEarning,
        type: "admin_override_release",
        description: `Admin override release: ${reason}`,
        metadata: { admin_id: user.id, reason }
      });

      // Update order
      await supabase
        .from("orders")
        .update({ status: "completed", updated_at: now })
        .eq("id", orderId);

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
            total_commissions: platformBalance.total_commissions + (order.platform_commission || 0),
            updated_at: now
          })
          .eq("id", platformBalance.id);
      }

    } else if (action === "reverse") {
      // Admin reversing a completed order (clawback)
      if (order.status !== "completed") {
        throw new Error("Can only reverse completed orders");
      }

      const { data: store } = await supabase
        .from("stores")
        .select("user_id")
        .eq("id", order.store_id)
        .single();

      if (!store) {
        throw new Error("Store not found");
      }

      const sellerId = store.user_id;
      const sellerEarning = order.seller_earning || 0;

      // Get seller wallet
      const { data: wallet } = await supabase
        .from("seller_wallets")
        .select("id, balance, total_earnings")
        .eq("user_id", sellerId)
        .single();

      if (wallet) {
        // Deduct from wallet
        await supabase
          .from("seller_wallets")
          .update({
            balance: Math.max(0, (wallet.balance || 0) - sellerEarning),
            total_earnings: Math.max(0, (wallet.total_earnings || 0) - sellerEarning),
            updated_at: now,
          })
          .eq("id", wallet.id);

        // Record debit transaction
        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          order_id: orderId,
          amount: sellerEarning,
          type: "debit",
          status: "completed",
          description: `Admin reversal: Clawback for order #${orderId.slice(0, 8).toUpperCase()}`,
        });

        await supabase.from("financial_transactions").insert({
          user_id: sellerId,
          wallet_id: wallet.id,
          order_id: orderId,
          amount: -sellerEarning,
          type: "admin_reversal",
          description: `Admin reversal: ${reason}`,
          metadata: { admin_id: user.id, reason }
        });
      }

      // Revert order status
      await supabase
        .from("orders")
        .update({ status: "disputed", updated_at: now })
        .eq("id", orderId);

      // Update platform balance
      const { data: platformBalance } = await supabase
        .from("platform_balance")
        .select("*")
        .maybeSingle();

      if (platformBalance) {
        await supabase
          .from("platform_balance")
          .update({
            total_revenue: Math.max(0, platformBalance.total_revenue - order.total),
            total_commissions: Math.max(0, platformBalance.total_commissions - (order.platform_commission || 0)),
            updated_at: now
          })
          .eq("id", platformBalance.id);
      }
    }

    // Create audit log
    await supabase.rpc("create_audit_log", {
      p_action_type: `admin_override_${action}`,
      p_entity_type: "order",
      p_entity_id: orderId,
      p_details: {
        admin_id: user.id,
        action,
        reason,
        order_total: order.total,
        seller_earning: order.seller_earning
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: `Admin ${action} completed successfully`,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin override error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
