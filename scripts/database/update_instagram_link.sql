-- Update Instagram link in site_settings table
INSERT INTO site_settings (key, value)
VALUES ('instagram', 'https://www.instagram.com/growup_fincorp_rajkot?igsh=MW96cmRjYW0wMHFkcQ==')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
