-- Fix overly permissive RLS policy on site_analytics
-- Instead of allowing anyone to insert, we'll require a session_id and add validation
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.site_analytics;

-- Create a more restrictive insert policy - only allow inserts with valid session data
CREATE POLICY "Insert analytics with session"
  ON public.site_analytics FOR INSERT
  WITH CHECK (
    session_id IS NOT NULL 
    AND page_path IS NOT NULL 
    AND LENGTH(session_id) >= 10
  );