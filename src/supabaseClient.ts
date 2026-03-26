import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Anon Key
// In a real project, these should be placed in an .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
