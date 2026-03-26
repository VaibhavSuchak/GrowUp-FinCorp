-- GO-LIVE CLEANUP SCRIPT
-- RUN THIS IN THE SUPABASE SQL EDITOR TO CLEAR ALL DEMO DATA

-- 1. Clear all enquiries (CRM Leads)
DELETE FROM enquiries;

-- 2. Clear all customer reviews
DELETE FROM reviews;

-- 3. Reset ID sequences (Optional, ensures next entry starts at 1)
-- ALTER SEQUENCE enquiries_id_seq RESTART WITH 1;
-- ALTER SEQUENCE reviews_id_seq RESTART WITH 1;

-- NOTE: This action is irreversible. Ensure you have backups if needed.
