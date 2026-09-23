import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cpuozescydngqeopjncm.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdW96ZXNjeWRuZ3Flb3BqbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzgzOTYsImV4cCI6MjEwNTY1NDM5Nn0.wQ7Wp_CUeFdV2v3ZNcrtE_jf4eIJTyYrOBkJ2yo33uU";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll called from a Server Component; ignore since proxy refreshes sessions
        }
      },
    },
  });
}
