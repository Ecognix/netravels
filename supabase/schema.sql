create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  package_slug text not null check (package_slug in (
    'meghalaya-cloud-trails', 'assam-river-and-wild', 'sikkim-mountains-and-monasteries',
    'arunachal-tawang-journey', 'nagaland-culture-and-hills', 'arunachal-ziro-valley'
  )),
  package_name text not null check (char_length(package_name) between 1 and 150),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null check (char_length(phone) between 7 and 30),
  travel_date date not null,
  travellers integer not null check (travellers between 1 and 20),
  notes text not null default '' check (char_length(notes) <= 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.booking_requests enable row level security;

create policy "Admins can see own membership" on public.admin_users
  for select to authenticated using (user_id = auth.uid());
create policy "Users can see their requests" on public.booking_requests
  for select to authenticated using (user_id = auth.uid());
create policy "Users can create their requests" on public.booking_requests
  for insert to authenticated with check (
    user_id = auth.uid() and status = 'new' and travel_date >= current_date
    and lower(email) = lower(auth.jwt() ->> 'email')
  );
create policy "Admins can see requests" on public.booking_requests
  for select to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );
create policy "Admins can update requests" on public.booking_requests
  for update to authenticated using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  ) with check (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

grant select on public.admin_users to authenticated;
grant select, insert on public.booking_requests to authenticated;
grant update (status) on public.booking_requests to authenticated;
