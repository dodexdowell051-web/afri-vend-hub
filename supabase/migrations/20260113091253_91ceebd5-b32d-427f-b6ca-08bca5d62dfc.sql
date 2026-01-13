
-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles (only admins can manage)
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create platform_balance table for tracking company finances
CREATE TABLE public.platform_balance (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    total_revenue numeric NOT NULL DEFAULT 0,
    total_commissions numeric NOT NULL DEFAULT 0,
    pending_payouts numeric NOT NULL DEFAULT 0,
    completed_payouts numeric NOT NULL DEFAULT 0,
    updated_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on platform_balance
ALTER TABLE public.platform_balance ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage platform balance
CREATE POLICY "Admins can view platform balance"
ON public.platform_balance
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update platform balance"
ON public.platform_balance
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create payouts table
CREATE TABLE public.payouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet_id uuid NOT NULL REFERENCES public.seller_wallets(id),
    amount numeric NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    payment_method text,
    payment_reference text,
    bank_name text,
    account_number text,
    account_name text,
    notes text,
    processed_by uuid REFERENCES auth.users(id),
    processed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on payouts
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own payouts
CREATE POLICY "Sellers can view own payouts"
ON public.payouts
FOR SELECT
TO authenticated
USING (auth.uid() = seller_id);

-- Sellers can request payouts
CREATE POLICY "Sellers can create payout requests"
ON public.payouts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = seller_id);

-- Admins can manage all payouts
CREATE POLICY "Admins can manage all payouts"
ON public.payouts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create financial_transactions table for audit logging
CREATE TABLE public.financial_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL CHECK (type IN ('payment', 'commission', 'payout', 'refund', 'adjustment')),
    amount numeric NOT NULL,
    order_id uuid REFERENCES public.orders(id),
    payout_id uuid REFERENCES public.payouts(id),
    wallet_id uuid REFERENCES public.seller_wallets(id),
    user_id uuid REFERENCES auth.users(id),
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on financial_transactions
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Only admins can view all transactions
CREATE POLICY "Admins can view all transactions"
ON public.financial_transactions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Sellers can view their own transactions
CREATE POLICY "Sellers can view own transactions"
ON public.financial_transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add seller_status to profiles for approval workflow
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS seller_status text DEFAULT 'pending' CHECK (seller_status IN ('pending', 'approved', 'suspended'));

-- Add is_suspended to stores table
ALTER TABLE public.stores
ADD COLUMN IF NOT EXISTS is_suspended boolean DEFAULT false;

-- Update products policy to check store suspension
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (
    is_active = true 
    AND NOT EXISTS (
        SELECT 1 FROM stores 
        WHERE stores.id = products.store_id 
        AND stores.is_suspended = true
    )
);

-- Admins can view all products
CREATE POLICY "Admins can view all products"
ON public.products
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any product
CREATE POLICY "Admins can update any product"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update any order
CREATE POLICY "Admins can update any order"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all stores
CREATE POLICY "Admins can manage all stores"
ON public.stores
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can view all wallets
CREATE POLICY "Admins can view all wallets"
ON public.seller_wallets
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all wallets
CREATE POLICY "Admins can update all wallets"
ON public.seller_wallets
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage platform settings
CREATE POLICY "Admins can manage platform settings"
ON public.platform_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on payouts
CREATE TRIGGER update_payouts_updated_at
BEFORE UPDATE ON public.payouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Create trigger for updated_at on platform_balance
CREATE TRIGGER update_platform_balance_updated_at
BEFORE UPDATE ON public.platform_balance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Insert initial platform balance record
INSERT INTO public.platform_balance (id, total_revenue, total_commissions, pending_payouts, completed_payouts)
VALUES (gen_random_uuid(), 0, 0, 0, 0);
