-- Create contact enquiries table
CREATE TABLE public.contact_enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  surname TEXT NOT NULL,
  first_names TEXT NOT NULL,
  country_of_residence TEXT NOT NULL,
  email_address TEXT NOT NULL,
  enquiry_type TEXT NOT NULL,
  travel_date DATE,
  duration TEXT,
  number_of_persons INTEGER DEFAULT 1,
  other_information TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  CONSTRAINT enquiry_surname_length CHECK (char_length(surname) <= 100),
  CONSTRAINT enquiry_first_names_length CHECK (char_length(first_names) <= 150),
  CONSTRAINT enquiry_country_length CHECK (char_length(country_of_residence) <= 100),
  CONSTRAINT enquiry_email_length CHECK (char_length(email_address) <= 255),
  CONSTRAINT enquiry_type_valid CHECK (enquiry_type IN ('Enquiries', 'Flights', 'Shuttles', 'Tours', 'Stays')),
  CONSTRAINT enquiry_duration_length CHECK (char_length(duration) <= 100),
  CONSTRAINT enquiry_other_info_length CHECK (char_length(other_information) <= 2000),
  CONSTRAINT enquiry_persons_valid CHECK (number_of_persons >= 1 AND number_of_persons <= 100)
);

-- Enable Row Level Security
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit enquiries (public form)
CREATE POLICY "Anyone can submit enquiries"
ON public.contact_enquiries
FOR INSERT
TO public
WITH CHECK (
  surname IS NOT NULL AND
  first_names IS NOT NULL AND
  country_of_residence IS NOT NULL AND
  email_address IS NOT NULL AND
  enquiry_type IS NOT NULL
);

-- Only admins can view enquiries
CREATE POLICY "Admins can view all enquiries"
ON public.contact_enquiries
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update enquiries
CREATE POLICY "Admins can update enquiries"
ON public.contact_enquiries
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete enquiries
CREATE POLICY "Admins can delete enquiries"
ON public.contact_enquiries
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add rate limiting function for contact enquiries
CREATE OR REPLACE FUNCTION public.check_enquiry_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO recent_count
  FROM public.contact_enquiries
  WHERE email_address = NEW.email_address
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Too many enquiry requests. Please try again later.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public;

-- Create trigger for rate limiting
CREATE TRIGGER enquiry_rate_limit_trigger
BEFORE INSERT ON public.contact_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.check_enquiry_rate_limit();