-- Migration: 0004_operations_read_policies.sql
-- Enables public read policies for vendors, vouchers, trip assignments, and trip captain profiles
-- Allows the Operations Logistics dashboard and client views to read inventory and assignments seamlessly

-- 1. Vendors public read policy
DROP POLICY IF EXISTS "vendors_public_read" ON public.vendors;
CREATE POLICY "vendors_public_read" ON public.vendors FOR SELECT USING (true);

-- 2. Vouchers public read policy
DROP POLICY IF EXISTS "vouchers_public_read" ON public.vouchers;
CREATE POLICY "vouchers_public_read" ON public.vouchers FOR SELECT USING (true);

-- 3. Trip assignments public read policy
DROP POLICY IF EXISTS "trip_assignments_public_read" ON public.trip_assignments;
CREATE POLICY "trip_assignments_public_read" ON public.trip_assignments FOR SELECT USING (true);

-- 4. Trip Captain profiles read policy
DROP POLICY IF EXISTS "profiles_captains_read" ON public.profiles;
CREATE POLICY "profiles_captains_read" ON public.profiles FOR SELECT USING (role = 'trip_captain');
