-- A "departure" is one real batch of a tour on a specific date — the actual
-- unit that hotels, vehicles, captains, and bookings all attach to. Previously
-- these were all just matched by free-text tour_title + departure_date
-- strings (typo-prone, no dedup). This gives that concept a real identity.
create table if not exists public.departures (
  id uuid primary key default gen_random_uuid(),
  tour_id text references public.tours(id) on delete set null,
  tour_title text not null,
  departure_date text not null,
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','completed','cancelled')),
  capacity int,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tour_title, departure_date)
);

alter table public.departures enable row level security;
create policy "departures_staff_all" on public.departures for all
  using (public.current_role_is(array['admin','sales','operations']::user_role[]))
  with check (public.current_role_is(array['admin','sales','operations']::user_role[]));

-- Structured links (nullable — old free-text tour_title/departure_date columns
-- stay in place for display and backward compatibility).
alter table public.hotel_assignments add column if not exists departure_id uuid references public.departures(id) on delete set null;
alter table public.vehicle_assignments add column if not exists departure_id uuid references public.departures(id) on delete set null;
alter table public.trip_assignments add column if not exists departure_id uuid references public.departures(id) on delete set null;
alter table public.bookings add column if not exists departure_id uuid references public.departures(id) on delete set null;

-- Backfill: create a departure row for every distinct (tour_title, departure_date)
-- combination already in use across these tables, then link them up.
insert into public.departures (tour_id, tour_title, departure_date)
select distinct tour_id, tour_title, departure_date from public.hotel_assignments
on conflict (tour_title, departure_date) do nothing;

insert into public.departures (tour_id, tour_title, departure_date)
select distinct tour_id, tour_title, departure_date from public.vehicle_assignments
on conflict (tour_title, departure_date) do nothing;

insert into public.departures (tour_id, tour_title, departure_date)
select distinct tour_id, tour_title, departure_date from public.trip_assignments
on conflict (tour_title, departure_date) do nothing;

insert into public.departures (tour_id, tour_title, departure_date)
select distinct tour_id, tour_title, departure_date from public.bookings
on conflict (tour_title, departure_date) do nothing;

update public.hotel_assignments h set departure_id = d.id
from public.departures d where d.tour_title = h.tour_title and d.departure_date = h.departure_date and h.departure_id is null;

update public.vehicle_assignments v set departure_id = d.id
from public.departures d where d.tour_title = v.tour_title and d.departure_date = v.departure_date and v.departure_id is null;

update public.trip_assignments t set departure_id = d.id
from public.departures d where d.tour_title = t.tour_title and d.departure_date = t.departure_date and t.departure_id is null;

update public.bookings b set departure_id = d.id
from public.departures d where d.tour_title = b.tour_title and d.departure_date = b.departure_date and b.departure_id is null;
