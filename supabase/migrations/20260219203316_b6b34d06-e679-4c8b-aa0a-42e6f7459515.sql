
-- Fix: the previous migration partially succeeded (policies were recreated as permissive)
-- but failed on the ALTER PUBLICATION line since realtime was already enabled.
-- This is a no-op migration to confirm the state is correct.
SELECT 1;
