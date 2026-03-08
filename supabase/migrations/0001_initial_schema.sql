create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
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

create table if not exists public.categories (
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

create table if not exists public.subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug text not null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists public.vendors (
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
  primary_category_id uuid references public.categories(id) on delete set null,
  travels boolean not null default false,
  service_radius_km integer,
  owner_user_id uuid references public.user_profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendor_category_links (
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (vendor_id, category_id)
);

create table if not exists public.vendor_subcategory_links (
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  subcategory_id uuid not null references public.subcategories(id) on delete cascade,
  primary key (vendor_id, subcategory_id)
);

create table if not exists public.vendor_locations (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  label text,
  city text not null,
  region text,
  country text,
  is_primary boolean not null default false
);

create table if not exists public.vendor_images (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  storage_path text,
  url text not null,
  alt text,
  kind text not null check (kind in ('cover', 'gallery', 'logo')),
  position integer not null default 0
);

create table if not exists public.vendor_socials (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'facebook', 'website')),
  url text not null
);

create table if not exists public.rating_criteria (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  active boolean not null default true,
  position integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  overall_rating numeric(3,2) not null,
  title text,
  body text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.review_ratings (
  review_id uuid not null references public.reviews(id) on delete cascade,
  criterion_id uuid not null references public.rating_criteria(id) on delete cascade,
  score numeric(3,2) not null,
  primary key (review_id, criterion_id)
);

create table if not exists public.review_social_suggestions (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reviews(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'facebook', 'website')),
  url text not null
);

create table if not exists public.saved_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null,
  description text,
  is_public boolean not null default false,
  share_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_list_items (
  list_id uuid not null references public.saved_lists(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  note text,
  created_at timestamptz not null default now(),
  primary key (list_id, vendor_id)
);

create table if not exists public.vendor_claims (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  claimant_name text,
  verification_email text,
  verification_instagram text,
  verification_tiktok text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
