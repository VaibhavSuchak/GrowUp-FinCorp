-- PRODUCTION SCHEMA CLEANUP
-- RUN THIS IN THE SUPABASE SQL EDITOR TO REMOVE UNUSED TABLES

-- ⚠️ WARNING: This will permanently delete the following tables and their data.
-- These tables are not referenced anywhere in the current project source code.

-- 1. Remove redundant leads table (enquiries is used instead)
DROP TABLE IF EXISTS leads CASCADE;

-- 2. Remove unused site content table
DROP TABLE IF EXISTS site_content CASCADE;

-- 3. Remove unused logging and notification tables
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS admin_notifications CASCADE;

-- 4. Remove redundant admin profiles (Supabase Auth is handled via auth.users)
DROP TABLE IF EXISTS admin_users CASCADE;

-- NOTE: The following tables are REQUIRED for the project:
-- enquiries, reviews, site_settings, seo_settings, services, hero_sliders.
