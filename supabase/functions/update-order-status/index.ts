import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateStatusRequest {
  orderId: string;
  status: "processing" | "shipped" | "delivered";
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

    const { orderId, status }: UpdateStatusRequest = await req.json();
    console.log("Update order status request:", { orderId, status });

    if (!orderId || !status) {
      throw new Error("Missing required fields: orderId, status");
    }

    const validStatuses = ["processing", "shipped", "delivered"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the user is the seller for this order's store
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
      .select("id, status, store_id, seller_earning, payment_status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    // Verify user owns the store
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("id, user_id")
      .eq("id", order.store_id)
      .eq("user_id", user.id)
      .single();

    if (storeError || !store) {
      throw new Error("Unauthorized - you don't own this store");
    }

    // Validate status transitions
    const statusOrder = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(order.status || "pending");
    const newIndex = statusOrder.indexOf(status);

    if (newIndex <= currentIndex) {
      throw new Error(`Cannot change status from ${order.status} to ${status}`);
    }

    // Check payment status for processing
    if (status === "processing" && order.payment_status !== "paid") {
      throw new Error("Cannot process order - payment not confirmed");
    }

    const now = new Date().toISOString();
    const updateData: Record<string, unknown> = {
      status,
      updated_at: now,
    };

    // If marking as delivered, credit seller wallet
    if (status === "delivered") {
      updateData.delivered_at = now;

      // Get seller wallet
      const { data: wallet, error: walletError } = await supabase
        .from("seller_wallets")
        .select("id, balance, total_earnings")
        .eq("user_id", user.id)
        .single();

      if (walletError || !wallet) {
        console.error("Wallet not found, creating one...");
        // Create wallet if doesn't exist
        const { data: newWallet, error: createError } = await supabase
          .from("seller_wallets")
          .insert({
            user_id: user.id,
            balance: 0,
            total_earnings: 0,
          })
          .select()
          .single();

        if (createError) {
          throw new Error("Failed to create wallet");
        }

        // Update the new wallet
        const { error: updateWalletError } = await supabase
          .from("seller_wallets")
          .update({
            balance: order.seller_earning,
            total_earnings: order.seller_earning,
            updated_at: now,
          })
          .eq("id", newWallet.id);

        if (updateWalletError) {
          console.error("Error updating wallet:", updateWalletError);
        }

        // Record transaction
        await supabase.from("wallet_transactions").insert({
          wallet_id: newWallet.id,
          order_id: orderId,
          amount: order.seller_earning,
          type: "credit",
          status: "completed",
          description: `Earnings from order #${orderId.slice(0, 8).toUpperCase()}`,
        });
      } else {
        // Update existing wallet
        const newBalance = (wallet.balance || 0) + (order.seller_earning || 0);
        const newTotalEarnings = (wallet.total_earnings || 0) + (order.seller_earning || 0);

        const { error: updateWalletError } = await supabase
          .from("seller_wallets")
          .update({
            balance: newBalance,
            total_earnings: newTotalEarnings,
            updated_at: now,
          })
          .eq("id", wallet.id);

        if (updateWalletError) {
          console.error("Error updating wallet:", updateWalletError);
        }

        // Record transaction
        await supabase.from("wallet_transactions").insert({
          wallet_id: wallet.id,
          order_id: orderId,
          amount: order.seller_earning,
          type: "credit",
          status: "completed",
          description: `Earnings from order #${orderId.slice(0, 8).toUpperCase()}`,
        });

        console.log("Seller wallet updated:", { newBalance, newTotalEarnings });
      }
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (updateError) {
      throw new Error("Failed to update order status");
    }

    console.log("Order status updated successfully:", { orderId, status });

    return new Response(JSON.stringify({
      success: true,
      message: `Order status updated to ${status}`,
      walletUpdated: status === "delivered",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Update order status error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
