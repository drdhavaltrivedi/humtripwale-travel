-- SECURITY FIX: a set of `qual: true` policies were added to the operations
-- logistics tables (outside the normal migration flow), each duplicating an
-- already-correct staff-only policy but with no restriction at all. Net
-- effect: anyone with just the public anon key — no login required — could
-- read every vendor's payment terms and driver phone numbers, and could
-- insert/update/delete hotel/vehicle/vendor/trip-captain records outright.
-- This migration removes every one of those duplicate permissive policies.
-- The correctly-scoped policies from 0002/0005 (staff-only via
-- current_role_is(), or "own row" via contact_email/captain_id) remain and
-- are sufficient on their own.

drop policy if exists "vouchers_ops_write" on public.vouchers;
drop policy if exists "vouchers_public_read" on public.vouchers;

drop policy if exists "hotel_assignments_ops_write" on public.hotel_assignments;
drop policy if exists "hotel_assignments_public_read" on public.hotel_assignments;

drop policy if exists "vehicle_assignments_ops_write" on public.vehicle_assignments;
drop policy if exists "vehicle_assignments_public_read" on public.vehicle_assignments;

drop policy if exists "vendors_ops_write" on public.vendors;
drop policy if exists "vendors_public_read" on public.vendors;

drop policy if exists "trip_assignments_ops_write" on public.trip_assignments;
drop policy if exists "trip_assignments_public_read" on public.trip_assignments;

-- Reviews: legitimately public to READ (customer testimonials), but writes
-- had the same `qual: true` hole. There's no ownership column to scope
-- inserts by, so any authenticated user may submit one — matching SRS
-- "Registered User can Review Tours" — but only Admin may edit/delete.
drop policy if exists "Allow all write reviews" on public.reviews;
drop policy if exists "reviews_authenticated_insert" on public.reviews;
create policy "reviews_authenticated_insert" on public.reviews for insert
  with check (auth.uid() is not null);
drop policy if exists "reviews_admin_manage" on public.reviews;
create policy "reviews_admin_manage" on public.reviews for update
  using (public.current_role_is(array['admin']::user_role[]))
  with check (public.current_role_is(array['admin']::user_role[]));
drop policy if exists "reviews_admin_delete" on public.reviews;
create policy "reviews_admin_delete" on public.reviews for delete
  using (public.current_role_is(array['admin']::user_role[]));
