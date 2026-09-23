-- Adds the Trip Captain role and the Operations logistics tables
-- (hotels, vehicles, vendor finance, vouchers, trip assignments,
-- attendance, photos, notifications) per the SRS role matrix.

alter type user_role add value if not exists 'trip_captain';

-- ============ OPERATIONS: hotels / vehicles / vendors / vouchers ============
create table if not exists public.hotel_assignments (
  id uuid primary key default gen_random_uuid(),
  tour_id text references public.tours(id) on delete set null,
  tour_title text,
  departure_date text not null,
  hotel_name text not null,
  location text,
  check_in date,
  check_out date,
  rooms int default 1,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  notes text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vehicle_assignments (
  id uuid primary key default gen_random_uuid(),
  tour_id text references public.tours(id) on delete set null,
  tour_title text,
  departure_date text not null,
  vehicle_type text not null,
  vehicle_number text,
  driver_name text,
  driver_phone text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled')),
  notes text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('hotel','transport','activity','other')),
  contact_phone text,
  contact_email text,
  amount_due numeric default 0,
  amount_paid numeric default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending','partial','paid')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vouchers (
  id text primary key,
  booking_id text references public.bookings(id) on delete set null,
  voucher_type text not null check (voucher_type in ('hotel','transport','activity','full_trip')),
  issued_to text not null,
  details text,
  issued_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============ TRIP CAPTAIN ============
create table if not exists public.trip_assignments (
  id uuid primary key default gen_random_uuid(),
  captain_id uuid references public.profiles(id) on delete set null,
  tour_id text references public.tours(id) on delete set null,
  tour_title text not null,
  departure_date text not null,
  booking_ids text[] default '{}',
  status text not null default 'scheduled' check (status in ('scheduled','ongoing','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trip_attendance (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trip_assignments(id) on delete cascade,
  traveler_name text not null,
  present boolean not null default false,
  marked_at timestamptz
);

create table if not exists public.trip_photos (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trip_assignments(id) on delete cascade,
  url text not null,
  caption text,
  uploaded_at timestamptz not null default now()
);

create table if not exists public.trip_notifications (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trip_assignments(id) on delete cascade,
  message text not null,
  sent_at timestamptz not null default now()
);

-- ============ RLS ============
alter table public.hotel_assignments enable row level security;
alter table public.vehicle_assignments enable row level security;
alter table public.vendors enable row level security;
alter table public.vouchers enable row level security;
alter table public.trip_assignments enable row level security;
alter table public.trip_attendance enable row level security;
alter table public.trip_photos enable row level security;
alter table public.trip_notifications enable row level security;

create policy "hotel_assignments_ops" on public.hotel_assignments for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));

create policy "vehicle_assignments_ops" on public.vehicle_assignments for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));

create policy "vendors_ops" on public.vendors for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));

create policy "vouchers_ops" on public.vouchers for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));

create policy "trip_assignments_ops_manage" on public.trip_assignments for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));

create policy "trip_assignments_captain_read" on public.trip_assignments for select
  using (captain_id = auth.uid());

create policy "trip_assignments_captain_update_status" on public.trip_assignments for update
  using (captain_id = auth.uid())
  with check (captain_id = auth.uid());

create policy "trip_attendance_ops" on public.trip_attendance for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));
create policy "trip_attendance_captain" on public.trip_attendance for all
  using (exists (select 1 from public.trip_assignments t where t.id = trip_id and t.captain_id = auth.uid()))
  with check (exists (select 1 from public.trip_assignments t where t.id = trip_id and t.captain_id = auth.uid()));

create policy "trip_photos_ops" on public.trip_photos for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));
create policy "trip_photos_captain" on public.trip_photos for all
  using (exists (select 1 from public.trip_assignments t where t.id = trip_id and t.captain_id = auth.uid()))
  with check (exists (select 1 from public.trip_assignments t where t.id = trip_id and t.captain_id = auth.uid()));

create policy "trip_notifications_ops" on public.trip_notifications for all
  using (public.current_role_is(array['admin','operations']::user_role[]))
  with check (public.current_role_is(array['admin','operations']::user_role[]));
create policy "trip_notifications_captain" on public.trip_notifications for all
  using (exists (select 1 from public.trip_assignments t where t.id = trip_id and t.captain_id = auth.uid()))
  with check (exists (select 1 from public.trip_assignments t where t.id = trip_id and t.captain_id = auth.uid()));

-- Seed a Trip Captain into the staff allow-list (adjust email as needed).
insert into public.staff_role_map (email, role) values ('captain@demo.com', 'trip_captain')
on conflict (email) do update set role = excluded.role;
