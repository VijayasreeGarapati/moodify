import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured with valid credentials
export const isSupabaseConfigured = () => {
  const hasCredentials = !!supabaseUrl && !!supabaseKey && supabaseUrl !== '' && supabaseKey !== '';
  const isValidUrl = supabaseUrl.startsWith('https://') && !supabaseUrl.includes('your_supabase');
  const isValidKey = supabaseKey.length > 20 && !supabaseKey.includes('your_supabase');
  return hasCredentials && isValidUrl && isValidKey;
};

// Create Supabase client only if properly configured, otherwise create a dummy client
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');
