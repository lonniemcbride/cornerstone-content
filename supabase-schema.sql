-- Run in Supabase SQL Editor. Uses Auth users and row-level security.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  purpose text,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.workspace_members (
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('Owner','Admin','Publisher','Editor','Viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id,user_id)
);
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id),
  title text not null,
  caption text default '',
  channel text not null,
  publish_at timestamptz,
  status text not null default 'Draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.content_items enable row level security;
create policy "profile self access" on public.profiles for all using (id=auth.uid()) with check (id=auth.uid());
create policy "workspace member read" on public.workspaces for select using (owner_id=auth.uid() or exists(select 1 from public.workspace_members m where m.workspace_id=id and m.user_id=auth.uid()));
create policy "workspace owner manage" on public.workspaces for all using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy "membership member read" on public.workspace_members for select using (user_id=auth.uid() or exists(select 1 from public.workspaces w where w.id=workspace_id and w.owner_id=auth.uid()));
create policy "membership owner manage" on public.workspace_members for all using (exists(select 1 from public.workspaces w where w.id=workspace_id and w.owner_id=auth.uid())) with check (exists(select 1 from public.workspaces w where w.id=workspace_id and w.owner_id=auth.uid()));
create policy "content workspace read" on public.content_items for select using (exists(select 1 from public.workspaces w left join public.workspace_members m on m.workspace_id=w.id where w.id=workspace_id and (w.owner_id=auth.uid() or m.user_id=auth.uid())));
create policy "content editor write" on public.content_items for all using (owner_id=auth.uid() or exists(select 1 from public.workspace_members m where m.workspace_id=workspace_id and m.user_id=auth.uid() and m.role in ('Owner','Admin','Publisher','Editor'))) with check (owner_id=auth.uid() or exists(select 1 from public.workspace_members m where m.workspace_id=workspace_id and m.user_id=auth.uid() and m.role in ('Owner','Admin','Publisher','Editor')));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$ begin insert into public.profiles(id,email,full_name) values(new.id,new.email,new.raw_user_meta_data->>'full_name') on conflict(id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
