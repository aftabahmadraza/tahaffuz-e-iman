import { createClient } from "@supabase/supabase-js";

// SERVER-ONLY client — service role key se full write access.
// Isko kabhi bhi client component me import na karein.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
