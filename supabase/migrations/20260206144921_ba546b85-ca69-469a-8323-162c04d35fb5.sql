
-- Add itinerary, status (live/draft) fields to tours table
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft';
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS itinerary jsonb DEFAULT '[]'::jsonb;

-- Create CRM customers table
CREATE TABLE public.crm_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  phone text,
  country text,
  total_bookings integer DEFAULT 0,
  total_spent numeric DEFAULT 0,
  last_booking_date timestamp with time zone,
  notes text,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crm_customers ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage CRM data
CREATE POLICY "Admins can view CRM customers"
  ON public.crm_customers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert CRM customers"
  ON public.crm_customers FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update CRM customers"
  ON public.crm_customers FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete CRM customers"
  ON public.crm_customers FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Workers can view CRM
CREATE POLICY "Workers can view CRM customers"
  ON public.crm_customers FOR SELECT
  USING (has_role(auth.uid(), 'worker'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_crm_customers_updated_at
  BEFORE UPDATE ON public.crm_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index on user_id and email for fast lookups
CREATE INDEX idx_crm_customers_user_id ON public.crm_customers(user_id);
CREATE INDEX idx_crm_customers_email ON public.crm_customers(email);

-- Also add unique constraint on user_id
ALTER TABLE public.crm_customers ADD CONSTRAINT crm_customers_user_id_unique UNIQUE (user_id);

-- Create partner_applications table for "Become a Partner" page
CREATE TABLE public.partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text,
  website text,
  service_type text NOT NULL, -- 'tours', 'shuttle', 'both'
  description text,
  operating_regions text[],
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a partner application
CREATE POLICY "Anyone can submit partner application"
  ON public.partner_applications FOR INSERT
  WITH CHECK (company_name IS NOT NULL AND contact_person IS NOT NULL AND email IS NOT NULL AND service_type IS NOT NULL);

-- Admins can manage partner applications
CREATE POLICY "Admins can view partner applications"
  ON public.partner_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update partner applications"
  ON public.partner_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete partner applications"
  ON public.partner_applications FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_partner_applications_updated_at
  BEFORE UPDATE ON public.partner_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
