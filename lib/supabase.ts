import { createClient } from '@supabase/supabase-js';

// These should be set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for backend operations

// Check if credentials exist to avoid cryptic errors during development
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
}

// Service role client - bypassing RLS, use ONLY on the server
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
