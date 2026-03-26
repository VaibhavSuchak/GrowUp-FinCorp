-- Cleanup script to remove Education Loan service
-- Run this in your Supabase SQL Editor

-- 1. Delete the service entry
DELETE FROM public.services 
WHERE title ILIKE '%Education Loan%';

-- 2. (Optional) Deactivate instead of delete
-- UPDATE public.services 
-- SET active = false 
-- WHERE title ILIKE '%Education Loan%';

-- 3. Verify
SELECT * FROM public.services;
