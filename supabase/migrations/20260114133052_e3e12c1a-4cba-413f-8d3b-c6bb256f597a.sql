-- Create disputes table
CREATE TABLE public.disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  reason TEXT NOT NULL,
  buyer_evidence TEXT,
  seller_evidence TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved_buyer', 'resolved_seller', 'closed')),
  resolution_notes TEXT,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create refunds table
CREATE TABLE public.refunds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  dispute_id UUID REFERENCES public.disputes(id),
  amount NUMERIC NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_reference TEXT,
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table (immutable)
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  user_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add more platform settings
INSERT INTO public.platform_settings (key, value, description) VALUES
  ('min_withdrawal_amount', '5000', 'Minimum withdrawal amount in Naira'),
  ('payout_schedule', 'manual', 'Payout schedule: manual, weekly, bi-weekly'),
  ('auto_payouts_enabled', 'false', 'Enable automatic payouts'),
  ('escrow_release_days', '3', 'Days after delivery to auto-release escrow')
ON CONFLICT (key) DO NOTHING;

-- Add wallet_locked column to seller_wallets
ALTER TABLE public.seller_wallets ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
ALTER TABLE public.seller_wallets ADD COLUMN IF NOT EXISTS lock_reason TEXT;

-- Enable RLS on new tables
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Disputes policies
CREATE POLICY "Buyers can view own disputes" ON public.disputes
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view disputes for their orders" ON public.disputes
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can create disputes" ON public.disputes
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Parties can update their evidence" ON public.disputes
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Admins can manage all disputes" ON public.disputes
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Refunds policies
CREATE POLICY "Buyers can view own refunds" ON public.refunds
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = refunds.order_id AND orders.buyer_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all refunds" ON public.refunds
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Audit logs policies (only admins can view, no one can modify)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Create audit log function
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (action_type, entity_type, entity_id, user_id, details)
  VALUES (p_action_type, p_entity_type, p_entity_id, auth.uid(), p_details)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_refunds_updated_at
  BEFORE UPDATE ON public.refunds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();