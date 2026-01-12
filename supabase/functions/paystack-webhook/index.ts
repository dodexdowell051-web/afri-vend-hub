import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

// Simple HMAC-SHA512 implementation for webhook verification
async function verifyPaystackSignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-512" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(body)
    );
    const hashArray = Array.from(new Uint8Array(signatureBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
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

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    console.log("Webhook received, verifying signature...");

    // Verify webhook signature
    const isValid = await verifyPaystackSignature(body, signature, PAYSTACK_SECRET_KEY);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const event = JSON.parse(body);
    console.log("Webhook event:", event.event, event.data?.reference);

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (event.event === "charge.success") {
      const paymentData = event.data;
      const reference = paymentData.reference;

      // Check if already verified
      const { data: existingVerification } = await supabase
        .from("payment_verifications")
        .select("id")
        .eq("payment_reference", reference)
        .maybeSingle();

      if (existingVerification) {
        console.log("Payment already processed:", reference);
        return new Response(JSON.stringify({ message: "Already processed" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Get orders with this reference
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, store_id, seller_earning")
        .eq("payment_reference", reference);

      if (ordersError || !orders || orders.length === 0) {
        console.error("Orders not found for reference:", reference);
        return new Response(JSON.stringify({ error: "Orders not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Record verification
      await supabase
        .from("payment_verifications")
        .insert({
          payment_reference: reference,
          order_id: orders[0].id,
          amount: paymentData.amount / 100,
          paystack_response: paymentData,
        });

      // Update orders
      const now = new Date().toISOString();
      for (const order of orders) {
        await supabase
          .from("orders")
          .update({
            status: "processing",
            payment_status: "paid",
            paid_at: now,
            updated_at: now,
          })
          .eq("id", order.id);
      }

      console.log("Webhook processed successfully for", orders.length, "orders");
    }

    return new Response(JSON.stringify({ message: "Webhook processed" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
