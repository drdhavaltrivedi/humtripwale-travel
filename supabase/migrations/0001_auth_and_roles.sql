-- Real authentication + role-based access control for HumTripWale.
-- Run this once in the Supabase SQL Editor (or via `supabase db push`).

-- 1. Role enum ------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('traveler', 'sales', 'operations', 'admin');
  end if;
end $$;

-- 2. Staff allow-list -------------------------------------------------------
-- Emails listed here are auto-promoted to the given role the moment they
-- sign up (or if they already have an account, on next login via the trigger
-- below / a manual re-run of the backfill at the bottom of this file).
create table if not exists public.staff_role_map (
  email text primary key,
  role user_role not null
);

insert into public.staff_role_map (email, role) values
  ('admin@demo.com', 'admin'),
  ('sales@demo.com', 'sales'),
  ('opr@demo.com', 'operations')
on conflict (email) do update set role = excluded.role;

-- 3. Profiles table ----------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'traveler',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Security-definer helper so RLS policies can check "am I staff" without
-- recursively re-querying profiles under RLS (which would deadlock).
create or replace function public.current_role_is(target_roles user_role[])
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = any(target_roles)
  );
$$;

drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff" on public.profiles
  for select using (
    id = auth.uid() or public.current_role_is(array['admin','sales','operations']::user_role[])
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists "profiles_admin_manage" on public.profiles;
create policy "profiles_admin_manage" on public.profiles
  for all using (public.current_role_is(array['admin']::user_role[]))
  with check (public.current_role_is(array['admin']::user_role[]));

-- 4. Auto-create a profile (with the right role) whenever someone signs up --
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role user_role;
begin
  select role into assigned_role from public.staff_role_map where email = new.email;

  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(assigned_role, 'traveler')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

revoke execute on function public.handle_new_user() from public;

-- 5. RLS on business tables ---------------------------------------------------
-- Drop legacy "Allow all ..." permissive policies (using(true)) that predate
-- this migration — RLS policies are OR'd together, so leaving these in place
-- would silently defeat every staff-only policy below.
drop policy if exists "Allow all read leads" on public.leads;
drop policy if exists "Allow all update leads" on public.leads;
drop policy if exists "Allow all insert leads" on public.leads;
drop policy if exists "Allow all read bookings" on public.bookings;
drop policy if exists "Allow all update bookings" on public.bookings;
drop policy if exists "Allow all insert bookings" on public.bookings;
drop policy if exists "Allow all write tours" on public.tours;
drop policy if exists "Allow public read tours" on public.tours;
drop policy if exists "Allow all write itinerary_days" on public.itinerary_days;
drop policy if exists "Allow public read itinerary_days" on public.itinerary_days;
drop policy if exists "Allow all write blogs" on public.blogs;
drop policy if exists "Allow public read blogs" on public.blogs;

alter table if exists public.tours enable row level security;
alter table if exists public.itinerary_days enable row level security;
alter table if exists public.blogs enable row level security;
alter table if exists public.leads enable row level security;
alter table if exists public.bookings enable row level security;

drop policy if exists "tours_public_read" on public.tours;
create policy "tours_public_read" on public.tours for select using (true);
drop policy if exists "tours_staff_write" on public.tours;
create policy "tours_staff_write" on public.tours for all
  using (public.current_role_is(array['admin','sales']::user_role[]))
  with check (public.current_role_is(array['admin','sales']::user_role[]));

drop policy if exists "itinerary_public_read" on public.itinerary_days;
create policy "itinerary_public_read" on public.itinerary_days for select using (true);
drop policy if exists "itinerary_staff_write" on public.itinerary_days;
create policy "itinerary_staff_write" on public.itinerary_days for all
  using (public.current_role_is(array['admin','sales']::user_role[]))
  with check (public.current_role_is(array['admin','sales']::user_role[]));

drop policy if exists "blogs_public_read" on public.blogs;
create policy "blogs_public_read" on public.blogs for select using (true);
drop policy if exists "blogs_staff_write" on public.blogs;
create policy "blogs_staff_write" on public.blogs for all
  using (public.current_role_is(array['admin','sales']::user_role[]))
  with check (public.current_role_is(array['admin','sales']::user_role[]));

drop policy if exists "leads_staff_only" on public.leads;
create policy "leads_staff_only" on public.leads for all
  using (public.current_role_is(array['admin','sales','operations']::user_role[]))
  with check (public.current_role_is(array['admin','sales','operations']::user_role[]));
-- Public inquiry forms still need to create leads while logged out / as a traveler.
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads for insert with check (true);

drop policy if exists "bookings_staff_all" on public.bookings;
create policy "bookings_staff_all" on public.bookings for all
  using (public.current_role_is(array['admin','sales','operations']::user_role[]))
  with check (public.current_role_is(array['admin','sales','operations']::user_role[]));
drop policy if exists "bookings_own_read" on public.bookings;
create policy "bookings_own_read" on public.bookings for select
  using (contact_email = auth.jwt() ->> 'email');
drop policy if exists "bookings_own_insert" on public.bookings;
create policy "bookings_own_insert" on public.bookings for insert
  with check (contact_email = auth.jwt() ->> 'email');

-- 6. Backfill: if any of the 3 staff accounts already signed up before this
-- migration ran, promote them now.
update public.profiles p
set role = m.role
from public.staff_role_map m
where p.email = m.email and p.role <> m.role;

-- 7. Lock down staff_role_map itself — otherwise anyone with the anon key
-- could insert their own email as 'admin' and self-promote on next signup.
alter table public.staff_role_map enable row level security;
drop policy if exists "staff_role_map_admin_only" on public.staff_role_map;
create policy "staff_role_map_admin_only" on public.staff_role_map
  for all using (public.current_role_is(array['admin']::user_role[]))
  with check (public.current_role_is(array['admin']::user_role[]));
