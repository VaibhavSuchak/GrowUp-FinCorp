-- Supabase Database Schema for GrowUp FinCorp CMS (Updated v2)

-- 1. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  phone text,
  email text,
  city text,
  loan_type text,
  loan_amount text,
  message text, 
  status text DEFAULT 'New', -- New, Contacted, Pending, Completed
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Hero Sliders Table
CREATE TABLE IF NOT EXISTS public.hero_sliders (
  id text PRIMARY KEY,
  image text,
  headline text,
  subheading text,
  description text, -- ADDED THIS
  button_text text,
  button_link text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Site Content Table
CREATE TABLE IF NOT EXISTS public.site_content (
  section_key text PRIMARY KEY,
  content text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id text PRIMARY KEY,
  title text,
  tagline text,
  description text,
  rate text, -- ADDED THIS
  icon_or_image text,
  image_url text, -- ADDED THIS
  features jsonb DEFAULT '[]'::jsonb,
  stats jsonb DEFAULT '[]'::jsonb,
  docs jsonb DEFAULT '[]'::jsonb,
  accent text DEFAULT '#1a3a6b',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Seeding data moved to the end of the file for better organization.

-- 5. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id text PRIMARY KEY,
  title text,
  slug text UNIQUE,
  featured_image text,
  content text,
  author text,
  publish_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id text PRIMARY KEY,
  customer_name text,
  rating integer,
  review_text text,
  loan_type text, -- ADDED THIS
  approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SEO Settings Table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  page text PRIMARY KEY,
  title text,
  description text,
  keywords text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Leads Table (NEW)
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  service_interested text DEFAULT 'Home Loan',
  status text DEFAULT 'New', -- New, Follow-up, Converted
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Admin Users Table (NEW)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'Staff', -- Admin, Manager, Staff
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Admin Notifications Table (NEW)
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL, -- enquiry, lead, review
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Activity Logs Table (NEW)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text,
  action text NOT NULL,
  details text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert Default Site Settings
INSERT INTO public.site_settings (key, value) VALUES 
('phone', '+91 9924542956'),
('email', 'growupfincorp@gmail.com'),
('whatsapp', '9924542956'),
('admin_email', 'growupfincorp@gmail.com'),
('address', 'Rajkot, Gujarat, 360001'),
('googleMapsUrl', 'https://maps.google.com/?q=Mumbai'),
('instagram', 'https://instagram.com/growupfincorp'),
('facebook', 'https://facebook.com/growupfincorp'),
('linkedin', 'https://linkedin.com/company/growupfincorp')
ON CONFLICT (key) DO NOTHING;

-- Insert Default Admin User
INSERT INTO public.admin_users (name, email, role, is_active) VALUES
('Super Admin', 'growupfincorp@gmail.com', 'Admin', true)
ON CONFLICT (email) DO NOTHING;

-- 13. Seed Services Data
INSERT INTO public.services (id, title, tagline, icon_or_image, image_url, description, features, stats, docs, accent, active)
VALUES 
('home-loans', 'Home Loans', 'Your Dream Home, Realized', 'Home', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200', 'Explore customized mortgage solutions to help you secure your ideal home.', '["High Loan to Value Ratio", "Flexible Repayment Tenures", "Minimal Pre-payment Charges"]', '[{"label": "Attractive Rates", "val": "Starting Low"}, {"label": "Higher Eligibility", "val": "Flexible"}]', '["PAN & Aadhaar", "Bank Statements", "Salary Slips / ITR", "Property Documents"]', '#1a3a6b', true),
('business-loans', 'Business & MSME Loans', 'Fueling Your Business Growth', 'Briefcase', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200', 'Scale your operations or manage working capital with our range of business financing options.', '["Flexible Credit Lines", "Streamlined Processing", "Competitive Interest Rates"]', '[{"label": "Growth Focused", "val": "MSME Support"}, {"label": "High Limits", "val": "Tailored"}]', '["GST Registration", "ITR & Financials", "Business Proof", "Bank Statements"]', '#2ec4b6', true),
('personal-loans', 'Personal Loans', 'Support for Every Need', 'Lightbulb', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1200', 'Access credit for your personal needs through our efficient digital application flow.', '["No End-Use Restriction", "Digital Documentation", "Transparent Processing"]', '[{"label": "Fast Review", "val": "Secure"}, {"label": "Flexible Usage", "val": "Any Need"}]', '["Identity Proof", "Address Proof", "Recent Salary Slips", "Bank Statement"]', '#7c3aed', true),
('loan-against-property', 'Loan Against Property', 'Unlock Real Estate Value', 'Building2', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200', 'Leverage your property assets for significant funding at competitive market rates.', '["Consolidated Funding", "Longer Repayment Tenures", "Optimized Costs"]', '[{"label": "Leverage Value", "val": "Property Asset"}, {"label": "Lower Costs", "val": "Secured"}]', '["Original Title Deeds", "Sanctioned Plan", "Property Tax Receipts", "Income Proof"]', '#ea580c', true),
('auto-loans', 'Auto Financing', 'Drive Your Ambition', 'Car', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200', 'Secure funding for new and used vehicles with attractive interest rates.', '["New & Used Vehicles", "Dealer Coordination", "Transparent Terms"]', '[{"label": "On-Road Funding", "val": "Competitive"}, {"label": "Quick Review", "val": "Efficient"}]', '["Vehicle Quotation", "Driving License", "Bank Statement", "Income Proof"]', '#0891b2', true),
('machinery-loans', 'Machinery Loans', 'Empower Your Production', 'Settings', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200', 'Upgrade your industrial capacity with specialized machinery and equipment financing.', '["Up to 90% Financing", "Flexible EMI Options", "Quick Asset-Based Approval"]', '[{"label": "Industry 4.0", "val": "Tech Ready"}, {"label": "Tax Benefits", "val": "Depreciation"}]', '["Proforma Invoice", "Business Financials", "KYC Documents", "Machinery Details"]', '#6366f1', true)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    tagline = EXCLUDED.tagline,
    icon_or_image = EXCLUDED.icon_or_image,
    image_url = EXCLUDED.image_url,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    stats = EXCLUDED.stats,
    docs = EXCLUDED.docs,
    accent = EXCLUDED.accent,
    active = EXCLUDED.active;

-- 14. Seed Hero Sliders Data
INSERT INTO public.hero_sliders (id, image, headline, subheading, button_text, button_link, active)
VALUES 
('1', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070', 'Unlock Your Property Value.', 'Mortgage & Property Loans', 'Discover More', '/services', true),
('2', 'https://amnbfkdihvcjunaullbi.supabase.co/storage/v1/object/public/media/homeloan.png?t=1773562200000', 'Make Your Dream Home A Reality.', 'Home Loans from 8.5% p.a.', 'Apply Now', '/contact', true),
('3', 'https://amnbfkdihvcjunaullbi.supabase.co/storage/v1/object/public/media/business.png?t=1773562200000', 'Empowering Your Enterprise.', 'Business & MSME Loans', 'Expand Today', '/contact', true)
ON CONFLICT (id) DO NOTHING;

-- 15. Seed Reviews Data
INSERT INTO public.reviews (id, customer_name, rating, review_text, loan_type, approved)
VALUES 
('1', 'Arjun Mehta', 5, 'Amazing service from GrowUp FinCorp! Got my home loan approved in record time.', 'Home Loan', true),
('2', 'Meera Iyer', 5, 'Very professional team. They helped me with my business loan documentation and got the best rates.', 'Business Loan', true),
('3', 'Rahul Sharma', 4, 'Good experience overall. The digital process made things very easy.', 'Personal Loan', true)
ON CONFLICT (id) DO NOTHING;

-- RLS should be configured in the Supabase Dashboard.
-- For the website to display content publicly, we must allow SELECT access to the 'anon' role.

DROP POLICY IF EXISTS "Allow public read" ON public.services;
CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.site_content;
CREATE POLICY "Allow public read" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.blogs;
CREATE POLICY "Allow public read" ON public.blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.reviews;
CREATE POLICY "Allow public read" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.hero_sliders;
CREATE POLICY "Allow public read" ON public.hero_sliders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.seo_settings;
CREATE POLICY "Allow public read" ON public.seo_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.site_settings;
CREATE POLICY "Allow public read" ON public.site_settings FOR SELECT USING (true);

-- Enable RLS on these tables if not already enabled
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
