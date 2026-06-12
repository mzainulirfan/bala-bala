create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'cashier', 'kitchen');
create type public.order_status as enum ('waiting', 'processing', 'ready', 'completed', 'cancelled');
create type public.payment_status as enum ('unpaid', 'paid');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role public.user_role not null,
  created_at timestamptz not null default now()
);

create table public.menus (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  description text,
  price integer not null check (price >= 0),
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_sold_out boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.queue_counters (
  queue_date date primary key,
  last_number integer not null default 0
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  queue_number text not null,
  queue_date date not null default current_date,
  customer_name text not null check (char_length(customer_name) between 2 and 50),
  notes text check (notes is null or char_length(notes) <= 200),
  total_amount integer not null check (total_amount >= 0),
  status public.order_status not null default 'waiting',
  payment_status public.payment_status not null default 'unpaid',
  created_at timestamptz not null default now(),
  unique (queue_date, queue_number)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_id uuid references public.menus(id),
  menu_name text not null,
  price integer not null check (price >= 0),
  quantity integer not null check (quantity between 1 and 99),
  subtotal integer not null check (subtotal >= 0)
);

create or replace function public.generate_queue_number()
returns text
language plpgsql
security definer
as $$
declare
  next_number integer;
begin
  insert into public.queue_counters (queue_date, last_number)
  values (current_date, 1)
  on conflict (queue_date)
  do update set last_number = public.queue_counters.last_number + 1
  returning last_number into next_number;

  return 'A' || lpad(next_number::text, 3, '0');
end;
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'cashier', 'kitchen')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.menus enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.queue_counters enable row level security;

create policy "profiles staff read"
  on public.profiles for select
  using (public.is_staff());

create policy "profiles admin write"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "public reads active menus"
  on public.menus for select
  using (is_active = true or public.is_staff());

create policy "admin writes menus"
  on public.menus for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "public creates orders"
  on public.orders for insert
  with check (true);

create policy "public reads orders for tracking"
  on public.orders for select
  using (true);

create policy "staff updates orders"
  on public.orders for update
  using (public.is_staff())
  with check (public.is_staff());

create policy "public creates order items"
  on public.order_items for insert
  with check (true);

create policy "public reads order items"
  on public.order_items for select
  using (true);

create policy "staff reads counters"
  on public.queue_counters for select
  using (public.is_staff());

insert into public.menus (name, description, price, sort_order, is_active, is_sold_out)
values
  ('Bala-bala Viral', 'Bakwan sayur renyah dengan sambal khas.', 3000, 1, true, false),
  ('Gehu Pedas', 'Tahu isi sayur pedas, favorit antrean sore.', 3500, 2, true, false),
  ('Pisang Goreng', 'Pisang manis tepung crispy.', 4000, 3, true, false),
  ('Combro', 'Oncom pedas dalam singkong goreng.', 3500, 4, true, true);
