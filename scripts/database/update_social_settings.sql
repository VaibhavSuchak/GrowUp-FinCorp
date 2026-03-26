-- Update Social Media & Contact Settings
-- Run this in your Supabase SQL Editor

-- 1. Update the main phone number
INSERT INTO public.site_settings (key, value)
VALUES ('phone', '+91 99245 42956')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Update/Insert the WhatsApp number
INSERT INTO public.site_settings (key, value)
VALUES ('whatsapp', '9924542956')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. Cleanup unused keys (LinkedIn is removed from UI)
DELETE FROM public.site_settings WHERE key IN ('linkedin', 'twitter');

-- 4. Verify
SELECT * FROM public.site_settings WHERE key IN ('phone', 'whatsapp', 'facebook', 'instagram');
