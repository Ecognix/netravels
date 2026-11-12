-- Apply after schema.sql. Safe to re-run.
create table if not exists public.package_prices (
  slug text primary key,
  price_inr integer not null check (price_inr between 1 and 10000000),
  updated_at timestamptz not null default now()
);
alter table public.package_prices add column if not exists is_sample boolean not null default true;
insert into public.package_prices (slug, price_inr) values
  ('meghalaya-cloud-trails', 18900), ('assam-river-and-wild', 22500),
  ('sikkim-mountains-and-monasteries', 24900), ('arunachal-tawang-journey', 32900),
  ('nagaland-culture-and-hills', 19900), ('arunachal-ziro-valley', 23900)
on conflict (slug) do nothing;
alter table public.package_prices enable row level security;
drop policy if exists "Anyone can see prices" on public.package_prices;
create policy "Anyone can see prices" on public.package_prices for select to anon, authenticated using (true);
drop policy if exists "Admins can update prices" on public.package_prices;
create policy "Admins can update prices" on public.package_prices for update to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
grant select on public.package_prices to anon, authenticated;
grant update (price_inr, updated_at, is_sample) on public.package_prices to authenticated;

alter table public.booking_requests add column if not exists price_per_person_inr integer;
alter table public.booking_requests alter column status set default 'booked';
alter table public.booking_requests drop constraint if exists booking_requests_status_check;
alter table public.booking_requests add constraint booking_requests_status_check check (status in ('new','booked','contacted','closed','cancelled'));
drop policy if exists "Users can create their requests" on public.booking_requests;
create policy "Users can create their requests" on public.booking_requests for insert to authenticated with check (
  user_id = auth.uid() and status = 'booked' and travel_date >= current_date
  and lower(email) = lower(auth.jwt() ->> 'email')
);

create or replace function public.set_booking_price() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  select price_inr into new.price_per_person_inr from public.package_prices where slug = new.package_slug;
  if new.price_per_person_inr is null then raise exception 'Package price unavailable'; end if;
  return new;
end $$;
drop trigger if exists booking_set_price on public.booking_requests;
create trigger booking_set_price before insert on public.booking_requests
for each row execute function public.set_booking_price();

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null default '' check (char_length(phone) <= 30),
  subject text not null check (char_length(subject) between 2 and 150),
  message text not null check (char_length(message) between 10 and 3000),
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
drop policy if exists "Anyone can send enquiries" on public.contact_messages;
create policy "Anyone can send enquiries" on public.contact_messages for insert to anon, authenticated with check (true);
drop policy if exists "Admins can read enquiries" on public.contact_messages;
create policy "Admins can read enquiries" on public.contact_messages for select to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));
grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;

create or replace function public.admin_customers()
returns table (id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid()) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  return query select u.id, u.email::text, u.created_at, u.last_sign_in_at
    from auth.users u order by u.created_at desc limit 1000;
end $$;
revoke all on function public.admin_customers() from public, anon;
grant execute on function public.admin_customers() to authenticated;

create or replace function public.admin_analytics()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid()) then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'users', (select count(*) from auth.users),
    'bookings', (select count(*) from public.booking_requests),
    'enquiries', (select count(*) from public.contact_messages),
    'travellers', (select coalesce(sum(travellers), 0) from public.booking_requests where status <> 'cancelled'),
    'estimated_value', (select coalesce(sum(price_per_person_inr * travellers), 0) from public.booking_requests where status <> 'cancelled')
  );
end $$;
revoke all on function public.admin_analytics() from public, anon;
grant execute on function public.admin_analytics() to authenticated;
