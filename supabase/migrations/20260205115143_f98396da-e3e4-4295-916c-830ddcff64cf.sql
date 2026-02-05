-- Create supplier_status enum
CREATE TYPE public.supplier_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Create suppliers table for supplier accounts
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  website TEXT,
  description TEXT,
  status supplier_status NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create tours table for supplier-managed tours
CREATE TABLE public.tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  duration TEXT,
  image_url TEXT,
  badge TEXT,
  badge_type TEXT DEFAULT 'popular',
  rating NUMERIC DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  category TEXT DEFAULT 'tour',
  city TEXT,
  country TEXT DEFAULT 'South Africa',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stays table for property rentals
CREATE TABLE public.stays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  price_per_night NUMERIC NOT NULL CHECK (price_per_night >= 0),
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  amenities TEXT[],
  image_url TEXT,
  rating NUMERIC DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_2fa table for TOTP secrets
CREATE TABLE public.admin_2fa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  totp_secret TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create site_analytics table for visitor tracking
CREATE TABLE public.site_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_2fa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Suppliers policies
CREATE POLICY "Anyone can register as supplier"
  ON public.suppliers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Suppliers can view their own profile"
  ON public.suppliers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Suppliers can update their own profile"
  ON public.suppliers FOR UPDATE
  USING (auth.uid() = user_id AND status != 'suspended');

CREATE POLICY "Admins can view all suppliers"
  ON public.suppliers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update suppliers"
  ON public.suppliers FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete suppliers"
  ON public.suppliers FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Tours policies
CREATE POLICY "Anyone can view active tours"
  ON public.tours FOR SELECT
  USING (is_active = true);

CREATE POLICY "Approved suppliers can create tours"
  ON public.tours FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE user_id = auth.uid() 
      AND status = 'approved'
      AND id = supplier_id
    )
  );

CREATE POLICY "Suppliers can update their own tours"
  ON public.tours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE user_id = auth.uid() 
      AND status = 'approved'
      AND id = supplier_id
    )
  );

CREATE POLICY "Suppliers can delete their own tours"
  ON public.tours FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE user_id = auth.uid() 
      AND id = supplier_id
    )
  );

CREATE POLICY "Admins can manage all tours"
  ON public.tours FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Stays policies
CREATE POLICY "Anyone can view active stays"
  ON public.stays FOR SELECT
  USING (is_active = true);

CREATE POLICY "Approved suppliers can create stays"
  ON public.stays FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE user_id = auth.uid() 
      AND status = 'approved'
      AND id = supplier_id
    )
  );

CREATE POLICY "Suppliers can update their own stays"
  ON public.stays FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE user_id = auth.uid() 
      AND status = 'approved'
      AND id = supplier_id
    )
  );

CREATE POLICY "Suppliers can delete their own stays"
  ON public.stays FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers 
      WHERE user_id = auth.uid() 
      AND id = supplier_id
    )
  );

CREATE POLICY "Admins can manage all stays"
  ON public.stays FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin 2FA policies (only user and admin can access)
CREATE POLICY "Users can view their own 2FA settings"
  ON public.admin_2fa FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2FA"
  ON public.admin_2fa FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA"
  ON public.admin_2fa FOR UPDATE
  USING (auth.uid() = user_id);

-- Site analytics policies (only admins can read, anyone can insert)
CREATE POLICY "Anyone can insert analytics"
  ON public.site_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON public.site_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stays_updated_at
  BEFORE UPDATE ON public.stays
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_2fa_updated_at
  BEFORE UPDATE ON public.admin_2fa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add supplier role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'supplier';