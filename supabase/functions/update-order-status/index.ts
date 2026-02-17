import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateStatusRequest {
  orderId: string;
  status: "processing" | "ready_to_ship" | "shipped" | "delivered";
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

    const validStatuses = ["processing", "ready_to_ship", "shipped", "delivered"];
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
    const statusOrder = ["pending", "processing", "ready_to_ship", "shipped", "delivered"];
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

    // If marking as delivered, set delivered_at (NO wallet credit - escrow handles that)
    if (status === "delivered") {
      updateData.delivered_at = now;
    }

    // Insert notifications based on status
    const notificationsToInsert: Array<{user_id: string; title: string; message: string; type: string; link?: string}> = [];

    // Get buyer_id and order info for notifications
    const { data: fullOrder } = await supabase
      .from("orders")
      .select("buyer_id, total, store_id")
      .eq("id", orderId)
      .single();

    // Get admin users for notifications
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    const adminIds = adminRoles?.map(r => r.user_id) || [];

    if (status === "ready_to_ship") {
      // Notify buyer
      if (fullOrder?.buyer_id) {
        notificationsToInsert.push({
          user_id: fullOrder.buyer_id,
          title: "Order Ready to Ship",
          message: `Your order #${orderId.slice(0, 8).toUpperCase()} is being prepared for shipping.`,
          type: "order",
          link: "/orders"
        });
      }
      // Notify admins
      adminIds.forEach(adminId => {
        notificationsToInsert.push({
          user_id: adminId,
          title: "Seller Marked Ready",
          message: `Order #${orderId.slice(0, 8).toUpperCase()} marked as ready to ship.`,
          type: "order",
          link: "/admin/orders"
        });
      });
    } else if (status === "shipped") {
      if (fullOrder?.buyer_id) {
        notificationsToInsert.push({
          user_id: fullOrder.buyer_id,
          title: "Order Shipped",
          message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been shipped!`,
          type: "order",
          link: "/orders"
        });
      }
    } else if (status === "delivered") {
      if (fullOrder?.buyer_id) {
        notificationsToInsert.push({
          user_id: fullOrder.buyer_id,
          title: "Order Delivered",
          message: `Your order #${orderId.slice(0, 8).toUpperCase()} has been delivered. Please confirm delivery.`,
          type: "order",
          link: "/orders"
        });
      }
    }

    // Insert notifications
    if (notificationsToInsert.length > 0) {
      await supabase.from("notifications").insert(notificationsToInsert);
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
