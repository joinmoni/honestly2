-- Keep public.honestly_user_profiles in sync with auth.users on signup.
-- Also supports linking a profile row that already exists by email (e.g. seed) with null auth_user_id.

create or replace function public.honestly_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_full_name text;
  v_avatar text;
  v_provider text;
begin
  v_email := coalesce(nullif(trim(new.email), ''), nullif(trim(new.raw_user_meta_data->>'email'), ''));
  if v_email is null then
    return new;
  end if;

  v_full_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(trim(both ' ' from concat_ws(' ', nullif(trim(new.raw_user_meta_data->>'given_name'), ''), nullif(trim(new.raw_user_meta_data->>'family_name'), ''))), ''),
    split_part(v_email, '@', 1)
  );

  v_avatar := nullif(trim(coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  )), '');

  if new.raw_app_meta_data->>'provider' = 'google' then
    v_provider := 'google';
  else
    v_provider := null;
  end if;

  insert into public.honestly_user_profiles (auth_user_id, email, full_name, role, auth_provider, avatar_url)
  values (new.id, lower(v_email), v_full_name, 'user', v_provider, v_avatar)
  on conflict (email) do update set
    auth_user_id = coalesce(public.honestly_user_profiles.auth_user_id, excluded.auth_user_id),
    full_name = excluded.full_name,
    auth_provider = coalesce(public.honestly_user_profiles.auth_provider, excluded.auth_provider),
    avatar_url = coalesce(nullif(excluded.avatar_url, ''), public.honestly_user_profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_honestly_profile on auth.users;

create trigger on_auth_user_created_honestly_profile
  after insert on auth.users
  for each row
  execute function public.honestly_handle_new_auth_user();
