import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cpuozescydngqeopjncm.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdW96ZXNjeWRuZ3Flb3BqbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzgzOTYsImV4cCI6MjEwNTY1NDM5Nn0.wQ7Wp_CUeFdV2v3ZNcrtE_jf4eIJTyYrOBkJ2yo33uU";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
