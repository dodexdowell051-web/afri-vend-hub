
-- Fix the overly permissive INSERT policy - restrict to service role only
DROP POLICY "Service role can insert notifications" ON public.notifications;

-- Only allow inserts where user_id matches (for edge functions using service role, this is bypassed)
CREATE POLICY "System can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);
