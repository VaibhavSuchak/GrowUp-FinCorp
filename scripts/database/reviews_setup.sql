-- REVIEWS TABLE SETUP & RLS POLICIES

-- 1. Ensure the reviews table exists with the correct schema
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    loan_type TEXT,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 3. Public Policies
-- Allow anyone to INSERT a new review (to be moderated)
CREATE POLICY "Public can submit reviews" 
ON reviews FOR INSERT 
TO public 
WITH CHECK (approved = false); -- Ensure they can't self-approve

-- Allow anyone to SELECT only approved reviews
CREATE POLICY "Public can view approved reviews" 
ON reviews FOR SELECT 
TO public 
USING (approved = true);

-- 4. Admin Policies (Assuming authenticator role or service role handles admin)
-- Replace 'authenticated' with your specific admin role logic if needed
CREATE POLICY "Admins have full access" 
ON reviews FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- NOTE: If you are NOT using Supabase Auth for admins yet, 
-- you might need to use a service role key for the admin panel or 
-- define a more specific policy based on your admin detection logic.
