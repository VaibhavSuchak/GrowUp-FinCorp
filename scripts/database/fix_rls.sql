-- GrowUp Fincorp: Fix Row-Level Security (RLS) Policies
-- Run this in your Supabase SQL Editor to allow the Admin Panel to save changes.

-- 1. Enable RLS on all tables (if not already enabled)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 2. Allow Public (Unauthenticated) Access for Website Display
-- These allow anyone to view the website content.
DO $$ 
BEGIN
    -- Services
    DROP POLICY IF EXISTS "Allow public read" ON public.services;
    CREATE POLICY "Allow public read" ON public.services FOR SELECT USING (true);
    
    -- Site Content
    DROP POLICY IF EXISTS "Allow public read" ON public.site_content;
    CREATE POLICY "Allow public read" ON public.site_content FOR SELECT USING (true);
    
    -- Blogs
    DROP POLICY IF EXISTS "Allow public read" ON public.blogs;
    CREATE POLICY "Allow public read" ON public.blogs FOR SELECT USING (true);
    
    -- Reviews
    DROP POLICY IF EXISTS "Allow public read" ON public.reviews;
    CREATE POLICY "Allow public read" ON public.reviews FOR SELECT USING (true);
    
    -- Hero Sliders
    DROP POLICY IF EXISTS "Allow public read" ON public.hero_sliders;
    CREATE POLICY "Allow public read" ON public.hero_sliders FOR SELECT USING (true);
    
    -- SEO
    DROP POLICY IF EXISTS "Allow public read" ON public.seo_settings;
    CREATE POLICY "Allow public read" ON public.seo_settings FOR SELECT USING (true);
    
    -- Site Settings
    DROP POLICY IF EXISTS "Allow public read" ON public.site_settings;
    CREATE POLICY "Allow public read" ON public.site_settings FOR SELECT USING (true);
END $$;

-- 3. Allow Public (Unauthenticated) Submissions (Leads & Enquiries)
-- These allow website visitors to submit forms.
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow public insert" ON public.enquiries;
    CREATE POLICY "Allow public insert" ON public.enquiries FOR INSERT WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
    CREATE POLICY "Allow public insert" ON public.leads FOR INSERT WITH CHECK (true);
END $$;

-- 4. Allow FULL Admin Access (Authenticated Users)
-- These allow you to manage everything via the Admin Panel once logged in.
DO $$ 
DECLARE
    tbl_name text;
    tables text[] := ARRAY[
        'services', 'site_content', 'blogs', 'reviews', 
        'hero_sliders', 'seo_settings', 'site_settings', 
        'enquiries', 'leads', 'admin_notifications', 'activity_logs',
        'admin_users'
    ];
BEGIN
    FOREACH tbl_name IN ARRAY tables LOOP
        -- Remove existing admin policies if any
        EXECUTE format('DROP POLICY IF EXISTS "Allow admin all" ON public.%I', tbl_name);
        -- Create new wide-open policy for authenticated users
        EXECUTE format('CREATE POLICY "Allow admin all" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', tbl_name);
    END LOOP;
END $$;
