-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "System can update order status" ON public.orders;

-- Create more restrictive update policies
-- Sellers can update their store orders (status changes)
CREATE POLICY "Sellers can update order status"
ON public.orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = orders.store_id
    AND stores.user_id = auth.uid()
  )
);