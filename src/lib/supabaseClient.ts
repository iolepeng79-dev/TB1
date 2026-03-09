import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
  console.error('❌ Supabase credentials missing or invalid!');
  console.info('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your AI Studio Secrets.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

// Placeholder query to verify connection
export const verifyConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return false;
  }
};
