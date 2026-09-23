import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cpuozescydngqeopjncm.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwdW96ZXNjeWRuZ3Flb3BqbmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzgzOTYsImV4cCI6MjEwNTY1NDM5Nn0.wQ7Wp_CUeFdV2v3ZNcrtE_jf4eIJTyYrOBkJ2yo33uU";

// Role that can access each protected route prefix.
const ADMIN_CONSOLE_ROLES = new Set(["admin", "sales", "operations"]);
const CAPTAIN_ROLES = new Set(["admin", "trip_captain"]);

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith("/admin");
  const isCaptainRoute = pathname.startsWith("/captain");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!isAdminRoute && !isCaptainRoute && !isDashboardRoute) {
    return response;
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || "traveler";

  if (isAdminRoute && !ADMIN_CONSOLE_ROLES.has(role)) {
    // Trip Captains get their own dedicated console, not the full admin panel.
    return NextResponse.redirect(new URL(role === "trip_captain" ? "/captain" : "/dashboard", request.url));
  }

  if (isCaptainRoute && !CAPTAIN_ROLES.has(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
