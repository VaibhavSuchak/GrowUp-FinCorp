# Maintenance Scripts

This directory contains utility scripts for database migrations, authentication overrides, and general project maintenance.

## Directory Structure

### `auth/`
Scripts related to administrative user management.
- `update_admin_password.js`: Utility to reset the admin password directly via Supabase Auth API.

### `database/`
SQL fragments and schema definitions used to initialize or fix the Supabase backend.
- `admin_schema.sql`: Core schema for `site_settings` and `inquiries`.
- `fix_rls.sql`: Policies to allow correct frontend access to settings while protecting private data.
- `restore_hero_slides.sql`: Script to restore or seed the home page hero slider data.

## Usage
Most SQL scripts should be executed directly in the **Supabase SQL Editor**.
JS scripts (like password resets) require environment variables to be set (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) and can be run via Node:
```bash
node scripts/auth/update_admin_password.js
```
