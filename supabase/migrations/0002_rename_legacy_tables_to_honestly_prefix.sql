-- One-time upgrade for databases that still use unprefixed table names from an older 0001.
-- Skips every step when `honestly_*` tables already exist. Safe on fresh installs that only ran the updated 0001.

do $migrate$
begin
  if to_regclass('public.user_profiles') is not null and to_regclass('public.honestly_user_profiles') is null then
    alter table public.user_profiles rename to honestly_user_profiles;
  end if;
  if to_regclass('public.categories') is not null and to_regclass('public.honestly_categories') is null then
    alter table public.categories rename to honestly_categories;
  end if;
  if to_regclass('public.subcategories') is not null and to_regclass('public.honestly_subcategories') is null then
    alter table public.subcategories rename to honestly_subcategories;
  end if;
  if to_regclass('public.vendors') is not null and to_regclass('public.honestly_vendors') is null then
    alter table public.vendors rename to honestly_vendors;
  end if;
  if to_regclass('public.vendor_category_links') is not null and to_regclass('public.honestly_vendor_category_links') is null then
    alter table public.vendor_category_links rename to honestly_vendor_category_links;
  end if;
  if to_regclass('public.vendor_subcategory_links') is not null and to_regclass('public.honestly_vendor_subcategory_links') is null then
    alter table public.vendor_subcategory_links rename to honestly_vendor_subcategory_links;
  end if;
  if to_regclass('public.vendor_locations') is not null and to_regclass('public.honestly_vendor_locations') is null then
    alter table public.vendor_locations rename to honestly_vendor_locations;
  end if;
  if to_regclass('public.vendor_images') is not null and to_regclass('public.honestly_vendor_images') is null then
    alter table public.vendor_images rename to honestly_vendor_images;
  end if;
  if to_regclass('public.vendor_socials') is not null and to_regclass('public.honestly_vendor_socials') is null then
    alter table public.vendor_socials rename to honestly_vendor_socials;
  end if;
  if to_regclass('public.rating_criteria') is not null and to_regclass('public.honestly_rating_criteria') is null then
    alter table public.rating_criteria rename to honestly_rating_criteria;
  end if;
  if to_regclass('public.reviews') is not null and to_regclass('public.honestly_reviews') is null then
    alter table public.reviews rename to honestly_reviews;
  end if;
  if to_regclass('public.review_ratings') is not null and to_regclass('public.honestly_review_ratings') is null then
    alter table public.review_ratings rename to honestly_review_ratings;
  end if;
  if to_regclass('public.review_social_suggestions') is not null and to_regclass('public.honestly_review_social_suggestions') is null then
    alter table public.review_social_suggestions rename to honestly_review_social_suggestions;
  end if;
  if to_regclass('public.review_images') is not null and to_regclass('public.honestly_review_images') is null then
    alter table public.review_images rename to honestly_review_images;
  end if;
  if to_regclass('public.saved_lists') is not null and to_regclass('public.honestly_saved_lists') is null then
    alter table public.saved_lists rename to honestly_saved_lists;
  end if;
  if to_regclass('public.saved_list_items') is not null and to_regclass('public.honestly_saved_list_items') is null then
    alter table public.saved_list_items rename to honestly_saved_list_items;
  end if;
  if to_regclass('public.vendor_claims') is not null and to_regclass('public.honestly_vendor_claims') is null then
    alter table public.vendor_claims rename to honestly_vendor_claims;
  end if;
end
$migrate$;

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
