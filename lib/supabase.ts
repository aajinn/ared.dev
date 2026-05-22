import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public client — uses the anon key with RLS.
 * Only SELECT is allowed via RLS policy.
 * Use ONLY for read operations (getAllContent).
 */
export function getPublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Admin client — uses the service role key.
 * Bypasses all RLS. NEVER expose this to the browser
 * (must NOT use NEXT_PUBLIC_ prefix).
 * Use ONLY for write operations (updateContent).
 */
export function getAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}
