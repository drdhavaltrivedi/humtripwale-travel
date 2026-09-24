-- Destinations become a real CMS-managed table (previously fully static),
-- matching the same public-read / admin-or-sales-write pattern as tours/blogs.
create table if not exists public.destinations (
  id text primary key,
  slug text not null unique,
  name text not null,
  tagline text,
  description text,
  image text,
  tour_count int default 0,
  best_time text,
  ideal_duration text,
  avg_budget text,
  attractions jsonb default '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.destinations enable row level security;

create policy "destinations_public_read" on public.destinations for select using (true);
create policy "destinations_staff_write" on public.destinations for all
  using (public.current_role_is(array['admin','sales']::user_role[]))
  with check (public.current_role_is(array['admin','sales']::user_role[]));
