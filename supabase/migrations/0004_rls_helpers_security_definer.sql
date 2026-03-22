-- current_profile_id() and current_user_is_admin() SELECT from honestly_user_profiles.
-- RLS on that table references these functions, so without SECURITY DEFINER Postgres
-- re-enters RLS while evaluating the policy → "stack depth limit exceeded".
-- These helpers must read profiles with definer rights (bypass RLS for the inner query only).

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.id
  from public.honestly_user_profiles p
  where p.auth_user_id = (select auth.uid())
  limit 1
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.honestly_user_profiles p
    where p.auth_user_id = (select auth.uid())
      and p.role = 'admin'
  )
$$;

revoke all on function public.current_profile_id() from public;
revoke all on function public.current_user_is_admin() from public;

grant execute on function public.current_profile_id() to anon, authenticated, service_role;
grant execute on function public.current_user_is_admin() to anon, authenticated, service_role;
