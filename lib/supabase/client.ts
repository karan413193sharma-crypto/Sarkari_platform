import { createBrowserClient } from "@supabase/ssr";

// Used in client components. Server components/routes use lib/supabase/server.ts instead.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
