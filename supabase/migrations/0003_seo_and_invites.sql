-- Editable SEO fields per content item (tours already have `faqs`), plus
-- invite tracking on staff_role_map for the Admin "Invite Team Member" UI.

alter table public.tours add column if not exists seo_title text;
alter table public.tours add column if not exists seo_description text;

alter table public.blogs add column if not exists seo_title text;
alter table public.blogs add column if not exists seo_description text;
alter table public.blogs add column if not exists faqs jsonb default '[]'::jsonb;

alter table public.staff_role_map add column if not exists invited_at timestamptz default now();
alter table public.staff_role_map add column if not exists full_name text;
