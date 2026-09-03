import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () => {
  console.log('🔑 Creating Supabase client...');
  console.log('URL:', supabaseUrl);
  console.log('Key exists:', !!supabaseKey);

  return createBrowserClient(supabaseUrl!, supabaseKey!);
};