import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  email: string;
  amount: number;
  orderIds: string[];
  metadata?: Record<string, unknown>;
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
      console.error("Paystack secret key not configured");
      throw new Error("Payment service not configured");
    }

    const { email, amount, orderIds, metadata }: PaymentRequest = await req.json();
    console.log("Payment request received:", { email, amount, orderIds });

    if (!email || !amount || !orderIds || orderIds.length === 0) {
      throw new Error("Missing required fields: email, amount, orderIds");
    }

    // Generate unique reference
    const reference = `afv_${orderIds[0].slice(0, 8)}_${Date.now()}`;
    console.log("Generated payment reference:", reference);

    // Get platform commission rate
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: settingsData } = await supabase
      .from("platform_settings")
      .select("value")
      .eq("key", "commission_rate")
      .single();

    const commissionRate = settingsData ? parseFloat(settingsData.value) : 10;
    const platformCommission = (amount * commissionRate) / 100;
    const sellerEarning = amount - platformCommission;

    console.log("Commission calculation:", { commissionRate, platformCommission, sellerEarning });

    // Update orders with payment reference and calculated amounts
    for (const orderId of orderIds) {
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          payment_reference: reference,
          platform_commission: platformCommission / orderIds.length,
          seller_earning: sellerEarning / orderIds.length,
          customer_name: metadata?.customerName,
          delivery_phone: metadata?.phone,
          delivery_address: metadata?.address,
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Error updating order:", updateError);
      }
    }

    // Amount should be in kobo (smallest currency unit)
    const amountInKobo = Math.round(amount * 100);

    const origin = req.headers.get("origin") || "https://yowjsupwecwzyrkphtvv.lovableproject.com";
    const callbackUrl = `${origin}/order-confirmation?orderId=${orderIds[0]}&reference=${reference}`;
    console.log("Callback URL:", callbackUrl);

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          order_ids: orderIds,
          custom_fields: [
            {
              display_name: "Order IDs",
              variable_name: "order_ids",
              value: orderIds.join(","),
            },
          ],
          ...metadata,
        },
      }),
    });

    const data = await response.json();
    console.log("Paystack response:", data);

    if (!data.status) {
      throw new Error(data.message || "Failed to initialize payment");
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Payment initialization error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
