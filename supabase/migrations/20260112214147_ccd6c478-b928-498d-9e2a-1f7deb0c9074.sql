-- Create platform_settings table for configurable commission
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default commission rate (10%)
INSERT INTO public.platform_settings (key, value, description)
VALUES ('commission_rate', '10', 'Platform commission percentage on each sale');

-- Enable RLS on platform_settings
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read platform settings
CREATE POLICY "Anyone can read platform settings"
ON public.platform_settings FOR SELECT USING (true);

-- Add new columns to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_reference text,
ADD COLUMN payment_status text DEFAULT 'pending',
ADD COLUMN platform_commission numeric DEFAULT 0,
ADD COLUMN seller_earning numeric DEFAULT 0,
ADD COLUMN delivery_address text,
ADD COLUMN delivery_phone text,
ADD COLUMN customer_name text,
ADD COLUMN paid_at timestamp with time zone,
ADD COLUMN delivered_at timestamp with time zone;

-- Create wallet_transactions table for transaction history
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.seller_wallets(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on wallet_transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own wallet transactions
CREATE POLICY "Sellers can view own wallet transactions"
ON public.wallet_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.seller_wallets
    WHERE seller_wallets.id = wallet_transactions.wallet_id
    AND seller_wallets.user_id = auth.uid()
  )
);

-- Create payment_verifications table to prevent duplicate verifications
CREATE TABLE public.payment_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_reference text NOT NULL UNIQUE,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  verified_at timestamp with time zone DEFAULT now(),
  paystack_response jsonb
);

-- Enable RLS on payment_verifications
ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

-- Only system can insert/read payment verifications (via service role)
CREATE POLICY "Service role can manage payment verifications"
ON public.payment_verifications FOR ALL
USING (false);

-- Add update policy for orders so edge functions can update order status
CREATE POLICY "System can update order status"
ON public.orders FOR UPDATE
USING (true)
WITH CHECK (true);

-- Add insert policy for order_items
CREATE POLICY "Buyers can insert order items"
ON public.order_items FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
    AND orders.buyer_id = auth.uid()
  )
);

-- Add update trigger for platform_settings
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();