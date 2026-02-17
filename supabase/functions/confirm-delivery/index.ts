import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ConfirmDeliveryRequest {
  orderId: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get the authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { orderId }: ConfirmDeliveryRequest = await req.json();
    console.log("Confirm delivery request:", { orderId });

    if (!orderId) {
      throw new Error("Missing required field: orderId");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the requesting user is the buyer
    const anonClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Get the order and verify ownership
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id, 
        status, 
        payment_status, 
        buyer_id, 
        store_id, 
        total, 
        platform_commission, 
        seller_earning,
        delivered_at
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    // Verify user is the buyer
    if (order.buyer_id !== user.id) {
      throw new Error("Unauthorized - you are not the buyer of this order");
    }

    // Safety check: Prevent duplicate confirmation
    if (order.status === "completed") {
      throw new Error("Delivery already confirmed for this order");
    }

    // Safety check: Order must be shipped or delivered by seller
    if (order.status !== "shipped" && order.status !== "delivered") {
      throw new Error(`Cannot confirm delivery - order status is ${order.status}. Must be shipped or delivered.`);
    }

    // Safety check: Payment must be confirmed
    if (order.payment_status !== "paid") {
      throw new Error("Cannot confirm delivery - payment not confirmed");
    }

    // Check if there's an open dispute for this order
    const { data: dispute } = await supabase
      .from("disputes")
      .select("id, status")
      .eq("order_id", orderId)
      .in("status", ["pending", "under_review"])
      .maybeSingle();

    if (dispute) {
      throw new Error("Cannot confirm delivery - there is an open dispute for this order");
    }

    // Get store to find seller
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, user_id, name")
      .eq("id", order.store_id)
      .single();

    if (storeError || !store) {
      throw new Error("Store not found");
    }

    const sellerId = store.user_id;
    const sellerEarning = order.seller_earning || 0;
    const platformCommission = order.platform_commission || 0;
    const now = new Date().toISOString();

    // Start the escrow release process
    console.log("Starting escrow release:", { orderId, sellerId, sellerEarning, platformCommission });

    // 1. Get or create seller wallet
    let { data: wallet, error: walletError } = await supabase
      .from("seller_wallets")
      .select("id, balance, total_earnings")
      .eq("user_id", sellerId)
      .single();

    if (walletError || !wallet) {
      console.log("Wallet not found, creating one for seller:", sellerId);
      const { data: newWallet, error: createError } = await supabase
        .from("seller_wallets")
        .insert({
          user_id: sellerId,
          balance: 0,
          total_earnings: 0,
        })
        .select()
        .single();

      if (createError) {
        throw new Error("Failed to create seller wallet");
      }
      wallet = newWallet;
    }

    // 2. Update seller wallet balance (escrow release)
    const newBalance = (wallet.balance || 0) + sellerEarning;
    const newTotalEarnings = (wallet.total_earnings || 0) + sellerEarning;

    const { error: updateWalletError } = await supabase
      .from("seller_wallets")
      .update({
        balance: newBalance,
        total_earnings: newTotalEarnings,
        updated_at: now,
      })
      .eq("id", wallet.id);

    if (updateWalletError) {
      console.error("Failed to update wallet:", updateWalletError);
      throw new Error("Failed to release funds to seller wallet");
    }

    // 3. Record wallet transaction
    const { error: txError } = await supabase.from("wallet_transactions").insert({
      wallet_id: wallet.id,
      order_id: orderId,
      amount: sellerEarning,
      type: "credit",
      status: "completed",
      description: `Escrow release for order #${orderId.slice(0, 8).toUpperCase()} - Buyer confirmed delivery`,
    });

    if (txError) {
      console.error("Failed to record wallet transaction:", txError);
    }

    // 4. Record financial transaction for audit trail
    const { error: finTxError } = await supabase.from("financial_transactions").insert({
      user_id: sellerId,
      wallet_id: wallet.id,
      order_id: orderId,
      amount: sellerEarning,
      type: "escrow_release",
      description: `Funds released to seller from order #${orderId.slice(0, 8).toUpperCase()}`,
      metadata: {
        buyer_id: user.id,
        platform_commission: platformCommission,
        order_total: order.total,
        confirmed_at: now
      }
    });

    if (finTxError) {
      console.error("Failed to record financial transaction:", finTxError);
    }

    // 5. Record platform commission transaction
    const { error: commTxError } = await supabase.from("financial_transactions").insert({
      order_id: orderId,
      amount: platformCommission,
      type: "commission",
      description: `Platform commission from order #${orderId.slice(0, 8).toUpperCase()}`,
      metadata: {
        seller_id: sellerId,
        buyer_id: user.id,
        order_total: order.total,
        commission_rate: platformCommission > 0 ? ((platformCommission / order.total) * 100).toFixed(1) + "%" : "0%"
      }
    });

    if (commTxError) {
      console.error("Failed to record commission transaction:", commTxError);
    }

    // 6. Update platform balance
    const { data: platformBalance, error: balanceError } = await supabase
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
      // Create platform balance if doesn't exist
      await supabase.from("platform_balance").insert({
        total_revenue: order.total,
        total_commissions: platformCommission,
        pending_payouts: 0,
        completed_payouts: 0
      });
    }

    // 7. Update order status to completed
    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({
        status: "completed",
        delivered_at: order.delivered_at || now,
        updated_at: now,
      })
      .eq("id", orderId);

    if (orderUpdateError) {
      throw new Error("Failed to update order status");
    }

    // 8. Create audit log
    await supabase.rpc("create_audit_log", {
      p_action_type: "delivery_confirmed",
      p_entity_type: "order",
      p_entity_id: orderId,
      p_details: {
        buyer_id: user.id,
        seller_id: sellerId,
        order_total: order.total,
        seller_earning: sellerEarning,
        platform_commission: platformCommission,
        wallet_id: wallet.id,
        new_wallet_balance: newBalance
      }
    });

    // 9. Send notifications
    const notifications = [
      {
        user_id: sellerId,
        title: "Payment Received!",
        message: `₦${sellerEarning.toLocaleString()} has been credited to your wallet for order #${orderId.slice(0, 8).toUpperCase()}.`,
        type: "payment",
        link: "/dashboard"
      }
    ];

    // Notify admins
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    (adminRoles || []).forEach((r: { user_id: string }) => {
      notifications.push({
        user_id: r.user_id,
        title: "Order Completed & Payout Released",
        message: `Order #${orderId.slice(0, 8).toUpperCase()} completed. ₦${sellerEarning.toLocaleString()} released to seller.`,
        type: "payment",
        link: "/admin/orders"
      });
    });

    await supabase.from("notifications").insert(notifications);

    console.log("Escrow release completed successfully:", {
      orderId,
      sellerId,
      sellerEarning,
      platformCommission,
      newWalletBalance: newBalance
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Delivery confirmed and funds released to seller",
      data: {
        orderId,
        sellerEarning,
        platformCommission,
        newSellerBalance: newBalance
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Confirm delivery error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
