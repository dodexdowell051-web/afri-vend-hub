-- Add policy allowing sellers to view refunds for their store's orders
CREATE POLICY "Sellers can view refunds for their orders"
ON public.refunds
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM orders
    JOIN stores ON stores.id = orders.store_id
    WHERE orders.id = refunds.order_id
      AND stores.user_id = auth.uid()
  )
);