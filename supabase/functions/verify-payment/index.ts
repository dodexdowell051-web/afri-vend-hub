import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyRequest {
  reference: string;
  orderId?: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("Paystack secret key not configured");
    }

    const { reference, orderId }: VerifyRequest = await req.json();
    console.log("Verifying payment:", { reference, orderId });

    if (!reference) {
      throw new Error("Missing payment reference");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if payment was already verified (prevent duplicate)
    const { data: existingVerification } = await supabase
      .from("payment_verifications")
      .select("id")
      .eq("payment_reference", reference)
      .maybeSingle();

    if (existingVerification) {
      console.log("Payment already verified:", reference);
      return new Response(JSON.stringify({
        success: true,
        message: "Payment already verified",
        alreadyVerified: true,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    console.log("Paystack verification response:", data);

    if (!data.status) {
      throw new Error(data.message || "Failed to verify payment");
    }

    const paymentData = data.data;

    if (paymentData.status === "success") {
      // Get all orders with this payment reference
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, store_id, seller_earning")
        .eq("payment_reference", reference);

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw new Error("Failed to fetch orders");
      }

      console.log("Orders to update:", orders);

      // Record payment verification to prevent duplicates
      const { error: verificationError } = await supabase
        .from("payment_verifications")
        .insert({
          payment_reference: reference,
          order_id: orders?.[0]?.id || orderId,
          amount: paymentData.amount / 100,
          paystack_response: paymentData,
        });

      if (verificationError) {
        console.error("Error recording verification:", verificationError);
      }

      // Update all orders with this reference
      const now = new Date().toISOString();
      for (const order of orders || []) {
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "processing",
            payment_status: "paid",
            paid_at: now,
            updated_at: now,
          })
          .eq("id", order.id);

        if (updateError) {
          console.error("Error updating order:", updateError);
        }
      }

      console.log("Payment verified successfully, orders updated to processing");
    }

    return new Response(JSON.stringify({
      success: paymentData.status === "success",
      data: {
        status: paymentData.status,
        amount: paymentData.amount / 100,
        reference: paymentData.reference,
        paidAt: paymentData.paid_at,
        channel: paymentData.channel,
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Payment verification error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
