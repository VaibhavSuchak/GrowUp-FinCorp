-- Fix Review Submission: Permissions and ID Generation
-- Run this in your Supabase SQL Editor

-- 1. Set default ID generation for reviews table
-- This allows the frontend to omit the 'id' field
ALTER TABLE public.reviews 
ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;

-- 2. Add RLS policy to allow public submissions
-- This is necessary for visitors to leave reviews
DROP POLICY IF EXISTS "Allow public insert" ON public.reviews;
CREATE POLICY "Allow public insert" ON public.reviews 
FOR INSERT WITH CHECK (true);

-- 3. Verify
SELECT * FROM public.reviews LIMIT 1;
