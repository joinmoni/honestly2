-- Honestly initial schema: profiles, taxonomy, vendors, reviews, lists, claims, storage.
-- All application tables use the public.honestly_* prefix. App code: lib/services/supabase-data-layer.ts, admin APIs, lists, claims, search.

create extension if not exists "pgcrypto";

create table if not exists public.honestly_user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text not null unique,
  full_name text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  auth_provider text check (auth_provider in ('google', 'password')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.honestly_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  featured_on_home boolean not null default false,
  home_order integer,
  promoted_subcategories text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.honestly_subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.honestly_categories(id) on delete cascade,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists public.honestly_vendors (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  headline text,
  description text,
  verified boolean not null default false,
  claimed boolean not null default false,
  status text not null default 'active' check (status in ('active', 'suspended')),
  rating_avg numeric(3,2) not null default 0,
  review_count integer not null default 0,
  price_tier text check (price_tier in ('$', '$$', '$$$')),
  primary_category_id uuid references public.honestly_categories(id) on delete set null,
  travels boolean not null default false,
  service_radius_km integer,
  contact_email text,
  contact_phone text,
  owner_user_id uuid references public.honestly_user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.honestly_vendor_category_links (
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  category_id uuid not null references public.honestly_categories(id) on delete cascade,
  primary key (vendor_id, category_id)
);

create table if not exists public.honestly_vendor_subcategory_links (
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  subcategory_id uuid not null references public.honestly_subcategories(id) on delete cascade,
  primary key (vendor_id, subcategory_id)
);

create table if not exists public.honestly_vendor_locations (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  label text,
  city text not null,
  region text,
  country text,
  is_primary boolean not null default false
);

create table if not exists public.honestly_vendor_images (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  storage_path text,
  url text not null,
  alt text,
  kind text not null check (kind in ('cover', 'gallery', 'logo')),
  position integer not null default 0
);

create table if not exists public.honestly_vendor_socials (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'facebook', 'website')),
  url text not null
);

create table if not exists public.honestly_rating_criteria (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  active boolean not null default true,
  position integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- user_id null = admin-seeded / import; otherwise links to reviewer profile
create table if not exists public.honestly_reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  user_id uuid references public.honestly_user_profiles(id) on delete cascade,
  overall_rating numeric(3,2) not null,
  title text,
  body text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_name text,
  reviewer_email text,
  reviewer_avatar_url text,
  seeded_by_admin boolean not null default false,
  source text not null default 'user' check (source in ('user', 'admin', 'import')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.honestly_review_ratings (
  review_id uuid not null references public.honestly_reviews(id) on delete cascade,
  criterion_id uuid not null references public.honestly_rating_criteria(id) on delete cascade,
  score numeric(3,2) not null,
  primary key (review_id, criterion_id)
);

create table if not exists public.honestly_review_social_suggestions (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.honestly_reviews(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'facebook', 'website')),
  url text not null
);

create table if not exists public.honestly_review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.honestly_reviews(id) on delete cascade,
  storage_path text,
  url text not null,
  alt text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.honestly_saved_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.honestly_user_profiles(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean not null default false,
  share_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.honestly_saved_list_items (
  list_id uuid not null references public.honestly_saved_lists(id) on delete cascade,
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  primary key (list_id, vendor_id)
);

create table if not exists public.honestly_vendor_claims (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.honestly_vendors(id) on delete cascade,
  user_id uuid not null references public.honestly_user_profiles(id) on delete cascade,
  claimant_name text,
  verification_email text,
  verification_instagram text,
  verification_tiktok text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists idx_categories_home_order on public.honestly_categories(home_order);
create index if not exists idx_subcategories_category_id on public.honestly_subcategories(category_id);
create index if not exists idx_vendors_primary_category_id on public.honestly_vendors(primary_category_id);
create index if not exists idx_vendors_owner_user_id on public.honestly_vendors(owner_user_id);
create index if not exists idx_vendor_locations_vendor_id on public.honestly_vendor_locations(vendor_id);
create index if not exists idx_vendor_images_vendor_id on public.honestly_vendor_images(vendor_id);
create index if not exists idx_vendor_socials_vendor_id on public.honestly_vendor_socials(vendor_id);
create index if not exists idx_reviews_vendor_id on public.honestly_reviews(vendor_id);
create index if not exists idx_reviews_user_id on public.honestly_reviews(user_id);
create index if not exists idx_reviews_vendor_status on public.honestly_reviews(vendor_id, status);
create index if not exists idx_review_ratings_criterion_id on public.honestly_review_ratings(criterion_id);
create index if not exists idx_review_images_review_id on public.honestly_review_images(review_id);
create index if not exists idx_saved_lists_user_id on public.honestly_saved_lists(user_id);
create index if not exists idx_vendor_claims_vendor_id on public.honestly_vendor_claims(vendor_id);

drop trigger if exists set_updated_at_user_profiles on public.honestly_user_profiles;
create trigger set_updated_at_user_profiles
before update on public.honestly_user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_categories on public.honestly_categories;
create trigger set_updated_at_categories
before update on public.honestly_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_subcategories on public.honestly_subcategories;
create trigger set_updated_at_subcategories
before update on public.honestly_subcategories
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_vendors on public.honestly_vendors;
create trigger set_updated_at_vendors
before update on public.honestly_vendors
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_rating_criteria on public.honestly_rating_criteria;
create trigger set_updated_at_rating_criteria
before update on public.honestly_rating_criteria
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_reviews on public.honestly_reviews;
create trigger set_updated_at_reviews
before update on public.honestly_reviews
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_saved_lists on public.honestly_saved_lists;
create trigger set_updated_at_saved_lists
before update on public.honestly_saved_lists
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_vendor_claims on public.honestly_vendor_claims;
create trigger set_updated_at_vendor_claims
before update on public.honestly_vendor_claims
for each row execute function public.set_updated_at();

alter table public.honestly_user_profiles enable row level security;
alter table public.honestly_categories enable row level security;
alter table public.honestly_subcategories enable row level security;
alter table public.honestly_vendors enable row level security;
alter table public.honestly_vendor_category_links enable row level security;
alter table public.honestly_vendor_subcategory_links enable row level security;
alter table public.honestly_vendor_locations enable row level security;
alter table public.honestly_vendor_images enable row level security;
alter table public.honestly_vendor_socials enable row level security;
alter table public.honestly_rating_criteria enable row level security;
alter table public.honestly_reviews enable row level security;
alter table public.honestly_review_ratings enable row level security;
alter table public.honestly_review_social_suggestions enable row level security;
alter table public.honestly_review_images enable row level security;
alter table public.honestly_saved_lists enable row level security;
alter table public.honestly_saved_list_items enable row level security;
alter table public.honestly_vendor_claims enable row level security;

create or replace function public.current_profile_id()
returns uuid
language sql
stable
as $$
  select id
  from public.honestly_user_profiles
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.honestly_user_profiles
    where auth_user_id = auth.uid()
      and role = 'admin'
  )
$$;

drop policy if exists "public read categories" on public.honestly_categories;
create policy "public read categories" on public.honestly_categories
for select using (true);

drop policy if exists "admin manage categories" on public.honestly_categories;
create policy "admin manage categories" on public.honestly_categories
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read subcategories" on public.honestly_subcategories;
create policy "public read subcategories" on public.honestly_subcategories
for select using (true);

drop policy if exists "admin manage subcategories" on public.honestly_subcategories;
create policy "admin manage subcategories" on public.honestly_subcategories
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read active vendors" on public.honestly_vendors;
create policy "public read active vendors" on public.honestly_vendors
for select using (status = 'active' or public.current_user_is_admin());

drop policy if exists "admin manage vendors" on public.honestly_vendors;
create policy "admin manage vendors" on public.honestly_vendors
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read vendor category links" on public.honestly_vendor_category_links;
create policy "public read vendor category links" on public.honestly_vendor_category_links
for select using (true);

drop policy if exists "admin manage vendor category links" on public.honestly_vendor_category_links;
create policy "admin manage vendor category links" on public.honestly_vendor_category_links
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read vendor subcategory links" on public.honestly_vendor_subcategory_links;
create policy "public read vendor subcategory links" on public.honestly_vendor_subcategory_links
for select using (true);

drop policy if exists "admin manage vendor subcategory links" on public.honestly_vendor_subcategory_links;
create policy "admin manage vendor subcategory links" on public.honestly_vendor_subcategory_links
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read vendor locations" on public.honestly_vendor_locations;
create policy "public read vendor locations" on public.honestly_vendor_locations
for select using (true);

drop policy if exists "admin manage vendor locations" on public.honestly_vendor_locations;
create policy "admin manage vendor locations" on public.honestly_vendor_locations
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read vendor images" on public.honestly_vendor_images;
create policy "public read vendor images" on public.honestly_vendor_images
for select using (true);

drop policy if exists "admin manage vendor images" on public.honestly_vendor_images;
create policy "admin manage vendor images" on public.honestly_vendor_images
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read vendor socials" on public.honestly_vendor_socials;
create policy "public read vendor socials" on public.honestly_vendor_socials
for select using (true);

drop policy if exists "admin manage vendor socials" on public.honestly_vendor_socials;
create policy "admin manage vendor socials" on public.honestly_vendor_socials
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read rating criteria" on public.honestly_rating_criteria;
create policy "public read rating criteria" on public.honestly_rating_criteria
for select using (active = true or public.current_user_is_admin());

drop policy if exists "admin manage rating criteria" on public.honestly_rating_criteria;
create policy "admin manage rating criteria" on public.honestly_rating_criteria
for all using (public.current_user_is_admin()) with check (public.current_user_is_admin());

drop policy if exists "public read approved reviews" on public.honestly_reviews;
create policy "public read approved reviews" on public.honestly_reviews
for select using (
  status = 'approved'
  or public.current_user_is_admin()
  or user_id = public.current_profile_id()
);

drop policy if exists "users create reviews" on public.honestly_reviews;
create policy "users create reviews" on public.honestly_reviews
for insert with check (
  public.current_user_is_admin()
  or user_id = public.current_profile_id()
);

drop policy if exists "users update own reviews" on public.honestly_reviews;
create policy "users update own reviews" on public.honestly_reviews
for update using (
  public.current_user_is_admin()
  or user_id = public.current_profile_id()
) with check (
  public.current_user_is_admin()
  or user_id = public.current_profile_id()
);

drop policy if exists "admin manage reviews" on public.honestly_reviews;
create policy "admin manage reviews" on public.honestly_reviews
for delete using (public.current_user_is_admin());

drop policy if exists "public read review ratings" on public.honestly_review_ratings;
create policy "public read review ratings" on public.honestly_review_ratings
for select using (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_ratings.review_id
      and (honestly_reviews.status = 'approved' or public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
);

drop policy if exists "users manage review ratings" on public.honestly_review_ratings;
create policy "users manage review ratings" on public.honestly_review_ratings
for all using (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_ratings.review_id
      and (public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
) with check (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_ratings.review_id
      and (public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
);

drop policy if exists "public read review socials" on public.honestly_review_social_suggestions;
create policy "public read review socials" on public.honestly_review_social_suggestions
for select using (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_social_suggestions.review_id
      and (honestly_reviews.status = 'approved' or public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
);

drop policy if exists "users manage review socials" on public.honestly_review_social_suggestions;
create policy "users manage review socials" on public.honestly_review_social_suggestions
for all using (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_social_suggestions.review_id
      and (public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
) with check (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_social_suggestions.review_id
      and (public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
);

drop policy if exists "public read review images" on public.honestly_review_images;
create policy "public read review images" on public.honestly_review_images
for select using (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_images.review_id
      and (honestly_reviews.status = 'approved' or public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
);

drop policy if exists "users manage review images" on public.honestly_review_images;
create policy "users manage review images" on public.honestly_review_images
for all using (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_images.review_id
      and (public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
) with check (
  exists (
    select 1
    from public.honestly_reviews
    where honestly_reviews.id = honestly_review_images.review_id
      and (public.current_user_is_admin() or honestly_reviews.user_id = public.current_profile_id())
  )
);

drop policy if exists "users read own lists and public lists" on public.honestly_saved_lists;
create policy "users read own lists and public lists" on public.honestly_saved_lists
for select using (is_public = true or user_id = public.current_profile_id() or public.current_user_is_admin());

drop policy if exists "users manage own lists" on public.honestly_saved_lists;
create policy "users manage own lists" on public.honestly_saved_lists
for all using (user_id = public.current_profile_id() or public.current_user_is_admin())
with check (user_id = public.current_profile_id() or public.current_user_is_admin());

drop policy if exists "users read own list items and public list items" on public.honestly_saved_list_items;
create policy "users read own list items and public list items" on public.honestly_saved_list_items
for select using (
  exists (
    select 1
    from public.honestly_saved_lists
    where honestly_saved_lists.id = honestly_saved_list_items.list_id
      and (honestly_saved_lists.is_public = true or honestly_saved_lists.user_id = public.current_profile_id() or public.current_user_is_admin())
  )
);

drop policy if exists "users manage own list items" on public.honestly_saved_list_items;
create policy "users manage own list items" on public.honestly_saved_list_items
for all using (
  exists (
    select 1
    from public.honestly_saved_lists
    where honestly_saved_lists.id = honestly_saved_list_items.list_id
      and (honestly_saved_lists.user_id = public.current_profile_id() or public.current_user_is_admin())
  )
) with check (
  exists (
    select 1
    from public.honestly_saved_lists
    where honestly_saved_lists.id = honestly_saved_list_items.list_id
      and (honestly_saved_lists.user_id = public.current_profile_id() or public.current_user_is_admin())
  )
);

drop policy if exists "users read own claims and admins read all claims" on public.honestly_vendor_claims;
create policy "users read own claims and admins read all claims" on public.honestly_vendor_claims
for select using (user_id = public.current_profile_id() or public.current_user_is_admin());

drop policy if exists "users create claims" on public.honestly_vendor_claims;
create policy "users create claims" on public.honestly_vendor_claims
for insert with check (user_id = public.current_profile_id() or public.current_user_is_admin());

drop policy if exists "users update own claims and admins update all claims" on public.honestly_vendor_claims;
create policy "users update own claims and admins update all claims" on public.honestly_vendor_claims
for update using (user_id = public.current_profile_id() or public.current_user_is_admin())
with check (user_id = public.current_profile_id() or public.current_user_is_admin());

drop policy if exists "users read own profile and admins read all profiles" on public.honestly_user_profiles;
create policy "users read own profile and admins read all profiles" on public.honestly_user_profiles
for select using (auth_user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "users create own profile and admins create profiles" on public.honestly_user_profiles;
create policy "users create own profile and admins create profiles" on public.honestly_user_profiles
for insert with check (auth_user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "users update own profile and admins update all profiles" on public.honestly_user_profiles;
create policy "users update own profile and admins update all profiles" on public.honestly_user_profiles
for update using (auth_user_id = auth.uid() or public.current_user_is_admin())
with check (auth_user_id = auth.uid() or public.current_user_is_admin());

-- Storage buckets (usually allowed for the migration role).
insert into storage.buckets (id, name, public)
values ('vendor-media', 'vendor-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('review-media', 'review-media', true)
on conflict (id) do nothing;

-- Do not ALTER storage.objects or CREATE POLICY on storage.objects here: in Supabase Cloud
-- the dashboard SQL runner is not the owner of storage.objects (ERROR 42501).
-- After this migration, add the same rules in Dashboard → Storage → Policies, or use
-- supabase CLI migrations if your project grants sufficient ownership.
--
-- Policy A (SELECT, public read): bucket_id in ('vendor-media','review-media')
-- Policy B (ALL for admins): bucket_id in ('vendor-media','review-media')
--   AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
--   OR use a policy expression that matches how you expose admin in JWT.
-- Alternatively mirror app RLS with: exists (select 1 from public.honestly_user_profiles p
--   where p.auth_user_id = auth.uid() and p.role = 'admin')
