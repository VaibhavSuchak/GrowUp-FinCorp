import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function run() {
    console.log('Attempting to sign up admin@growupfincorp.com with password "growupfincorp"...');

    const { data, error } = await supabase.auth.signUp({
        email: 'admin@growupfincorp.com',
        password: 'growupfincorp'
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log('User already exists in auth.users.');
            console.log('Trying to login with "growupfincorp" just in case...');
            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: 'admin@growupfincorp.com',
                password: 'growupfincorp'
            });
            if (!loginError) {
                console.log('Login successful! Password is already "growupfincorp".');
            } else {
                console.log('Login failed: ', loginError.message);
            }
        } else {
            console.error('Signup failed:', error.message);
        }
    } else {
        console.log('Signup successful! Admin user created with the new password.');
    }
}

run();
