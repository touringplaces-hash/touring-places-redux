-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- Create a new INSERT policy that allows unauthenticated users to create bookings
-- This is intentional for a public booking form, but we validate the data in the edge function
CREATE POLICY "Anyone can create bookings"
ON public.bookings
FOR INSERT
TO public
WITH CHECK (
  customer_name IS NOT NULL AND
  customer_email IS NOT NULL AND
  destination IS NOT NULL AND
  travel_date IS NOT NULL AND
  booking_type IS NOT NULL
);