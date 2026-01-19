-- Create rate limiting function for bookings
CREATE OR REPLACE FUNCTION public.check_booking_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Count bookings from this email in the last hour
  SELECT COUNT(*)
  INTO recent_count
  FROM public.bookings
  WHERE customer_email = NEW.customer_email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Limit to 3 bookings per hour per email
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Too many booking requests. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Create trigger to enforce rate limit before insert
CREATE TRIGGER booking_rate_limit_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.check_booking_rate_limit();