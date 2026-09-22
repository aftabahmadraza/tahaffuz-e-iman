import { createClient } from "@supabase/supabase-js";

// Public/browser client — sirf READ ke liye (RLS "public read" policy ke sath)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
