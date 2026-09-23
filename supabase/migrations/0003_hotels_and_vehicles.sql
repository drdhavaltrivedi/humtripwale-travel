-- Migration: 0003_hotels_and_vehicles.sql
-- Adds image_url to hotel_assignments and vehicle_assignments
-- Adds public.hotels and public.vehicles master catalog tables with RLS and public read policies

-- 1. Add image_url to hotel_assignments and vehicle_assignments
ALTER TABLE public.hotel_assignments ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.vehicle_assignments ADD COLUMN IF NOT EXISTS image_url text;

-- 2. Create master hotels catalog table
CREATE TABLE IF NOT EXISTS public.hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  rating numeric(3,1) DEFAULT 4.8,
  room_types text[] DEFAULT '{"Deluxe Room", "Mountain View Suite"}',
  price_per_night numeric DEFAULT 3500,
  image_url text,
  amenities text[] DEFAULT '{"High-Speed Wi-Fi", "Heated Rooms", "Buffet Breakfast", "Scenic Mountain View"}',
  contact_phone text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 3. Create master vehicles catalog table
CREATE TABLE IF NOT EXISTS public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  capacity int DEFAULT 12,
  price_per_day numeric DEFAULT 4500,
  image_url text,
  features text[] DEFAULT '{"Pushback Seats", "Dual AC / Alpine Blower", "JBL Audio", "Luggage Carrier"}',
  registration_number text,
  driver_name text,
  driver_phone text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 4. Enable RLS and create policies
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "hotels_public_read" ON public.hotels;
CREATE POLICY "hotels_public_read" ON public.hotels FOR SELECT USING (true);

DROP POLICY IF EXISTS "hotels_staff_manage" ON public.hotels;
CREATE POLICY "hotels_staff_manage" ON public.hotels FOR ALL
  USING (public.current_role_is(array['admin','operations']::user_role[]))
  WITH CHECK (public.current_role_is(array['admin','operations']::user_role[]));

DROP POLICY IF EXISTS "vehicles_public_read" ON public.vehicles;
CREATE POLICY "vehicles_public_read" ON public.vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "vehicles_staff_manage" ON public.vehicles;
CREATE POLICY "vehicles_staff_manage" ON public.vehicles FOR ALL
  USING (public.current_role_is(array['admin','operations']::user_role[]))
  WITH CHECK (public.current_role_is(array['admin','operations']::user_role[]));

DROP POLICY IF EXISTS "hotel_assignments_public_read" ON public.hotel_assignments;
CREATE POLICY "hotel_assignments_public_read" ON public.hotel_assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "vehicle_assignments_public_read" ON public.vehicle_assignments;
CREATE POLICY "vehicle_assignments_public_read" ON public.vehicle_assignments FOR SELECT USING (true);
