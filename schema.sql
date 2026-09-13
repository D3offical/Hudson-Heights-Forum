
-- Hudson Heights Forum V5 Supabase schema
-- Run this entire file in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  role text not null default 'member' check (role in ('member','moderator','admin','faction_management')),
  created_at timestamptz not null default now()
);

create table if not exists public.threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 160),
  body text not null check (char_length(body) >= 1),
  category text not null default 'general',
  created_at timestamptz not null default now()
);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) >= 1),
  created_at timestamptz not null default now()
);

create table if not exists public.faction_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  faction_name text not null,
  leader_name text not null,
  discord_username text not null,
  member_count integer not null check (member_count >= 10),
  turf text not null,
  requested_tier text not null,
  background text not null,
  roleplay_plan text not null,
  forum_thread_link text not null,
  media_link text,
  status text not null default 'pending' check (status in ('pending','accepted','denied')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.threads enable row level security;
alter table public.replies enable row level security;
alter table public.faction_applications enable row level security;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop policy if exists "Profiles public read" on public.profiles;
create policy "Profiles public read" on public.profiles for select using (true);

drop policy if exists "Threads public read" on public.threads;
create policy "Threads public read" on public.threads for select using (true);
drop policy if exists "Threads authenticated insert" on public.threads;
create policy "Threads authenticated insert" on public.threads for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Threads owner update" on public.threads;
create policy "Threads owner update" on public.threads for update to authenticated using (auth.uid() = user_id);
drop policy if exists "Threads owner delete" on public.threads;
create policy "Threads owner delete" on public.threads for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Replies public read" on public.replies;
create policy "Replies public read" on public.replies for select using (true);
drop policy if exists "Replies authenticated insert" on public.replies;
create policy "Replies authenticated insert" on public.replies for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Replies owner delete" on public.replies;
create policy "Replies owner delete" on public.replies for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Applications owner insert" on public.faction_applications;
create policy "Applications owner insert" on public.faction_applications for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Applications owner read" on public.faction_applications;
create policy "Applications owner read" on public.faction_applications for select to authenticated using (
  auth.uid() = user_id
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','faction_management'))
);
drop policy if exists "Applications staff update" on public.faction_applications;
create policy "Applications staff update" on public.faction_applications for update to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','faction_management'))
);

-- After your first account is created, promote it manually:
-- update public.profiles set role='admin' where username='YOUR_USERNAME';
