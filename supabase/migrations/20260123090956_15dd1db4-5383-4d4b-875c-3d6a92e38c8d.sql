-- Add explicit deny policy for public/anonymous SELECT on bookings table
-- This provides defense-in-depth protection even if RLS is accidentally misconfigured

CREATE POLICY "Deny public read access to bookings"
ON public.bookings
FOR SELECT
TO anon
USING (false);

-- Add explicit deny policy for unauthenticated users
CREATE POLICY "Deny unauthenticated read access to bookings"
ON public.bookings
FOR SELECT
TO public
USING (false);