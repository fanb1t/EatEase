-- EatEase Supabase schema
-- Apply with: supabase db push

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type public.order_status as enum ('new', 'accepted', 'preparing', 'ready', 'served', 'cancelled');
  end if;
end $$;

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  table_number text not null unique,
  slug text not null unique,
  display_name text,
  seats integer not null default 4 check (seats > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_th text not null,
  name_en text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete restrict,
  slug text not null unique,
  name_th text not null,
  name_en text not null,
  description_th text,
  description_en text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  thumbnail_url text,
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.tables(id) on delete restrict,
  table_number text not null,
  customer_name text,
  status public.order_status not null default 'new',
  notes text,
  subtotal numeric(10, 2) not null default 0 check (subtotal >= 0),
  total numeric(10, 2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name_th text not null,
  item_name_en text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_menu_categories_active_sort on public.menu_categories(is_active, sort_order);
create index if not exists idx_menu_items_category_active_sort on public.menu_items(category_id, is_available, sort_order);
create index if not exists idx_orders_status_created_at on public.orders(status, created_at desc);
create index if not exists idx_orders_table_created_at on public.orders(table_id, created_at desc);
create index if not exists idx_order_items_order_id on public.order_items(order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_tables_updated_at on public.tables;
create trigger set_tables_updated_at
before update on public.tables
for each row execute function public.set_updated_at();

drop trigger if exists set_menu_categories_updated_at on public.menu_categories;
create trigger set_menu_categories_updated_at
before update on public.menu_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.recalculate_order_total()
returns trigger
language plpgsql
as $$
declare
  target_order_id uuid;
begin
  target_order_id = coalesce(new.order_id, old.order_id);

  update public.orders
  set
    subtotal = coalesce((
      select sum(line_total)
      from public.order_items
      where order_id = target_order_id
    ), 0),
    total = coalesce((
      select sum(line_total)
      from public.order_items
      where order_id = target_order_id
    ), 0),
    updated_at = now()
  where id = target_order_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists recalculate_order_total_insert on public.order_items;
create trigger recalculate_order_total_insert
after insert on public.order_items
for each row execute function public.recalculate_order_total();

drop trigger if exists recalculate_order_total_update on public.order_items;
create trigger recalculate_order_total_update
after update on public.order_items
for each row execute function public.recalculate_order_total();

drop trigger if exists recalculate_order_total_delete on public.order_items;
create trigger recalculate_order_total_delete
after delete on public.order_items
for each row execute function public.recalculate_order_total();

alter table public.tables enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read active tables" on public.tables;
create policy "Public can read active tables"
on public.tables for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated users manage tables" on public.tables;
create policy "Authenticated users manage tables"
on public.tables for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read active categories" on public.menu_categories;
create policy "Public can read active categories"
on public.menu_categories for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated users manage categories" on public.menu_categories;
create policy "Authenticated users manage categories"
on public.menu_categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can read available menu items" on public.menu_items;
create policy "Public can read available menu items"
on public.menu_items for select
to anon, authenticated
using (
  is_available = true
  and exists (
    select 1
    from public.menu_categories
    where menu_categories.id = menu_items.category_id
      and menu_categories.is_active = true
  )
);

drop policy if exists "Authenticated users manage menu items" on public.menu_items;
create policy "Authenticated users manage menu items"
on public.menu_items for all
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create orders" on public.orders;
create policy "Public can create orders"
on public.orders for insert
to anon, authenticated
with check (
  status = 'new'
  and exists (
    select 1
    from public.tables
    where tables.id = orders.table_id
      and tables.is_active = true
  )
);

drop policy if exists "Public can read orders for realtime" on public.orders;
create policy "Public can read orders for realtime"
on public.orders for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users update orders" on public.orders;
create policy "Authenticated users update orders"
on public.orders for update
to authenticated
using (true)
with check (true);

drop policy if exists "Public can create order items" on public.order_items;
create policy "Public can create order items"
on public.order_items for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
  )
);

drop policy if exists "Public can read order items for realtime" on public.order_items;
create policy "Public can read order items for realtime"
on public.order_items for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users manage order items" on public.order_items;
create policy "Authenticated users manage order items"
on public.order_items for all
to authenticated
using (true)
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-images',
  'menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read menu images" on storage.objects;
create policy "Public can read menu images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'menu-images');

drop policy if exists "Authenticated users upload menu images" on storage.objects;
create policy "Authenticated users upload menu images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated users update menu images" on storage.objects;
create policy "Authenticated users update menu images"
on storage.objects for update
to authenticated
using (bucket_id = 'menu-images')
with check (bucket_id = 'menu-images');

drop policy if exists "Authenticated users delete menu images" on storage.objects;
create policy "Authenticated users delete menu images"
on storage.objects for delete
to authenticated
using (bucket_id = 'menu-images');

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'orders'
    ) then
      alter publication supabase_realtime add table public.orders;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'order_items'
    ) then
      alter publication supabase_realtime add table public.order_items;
    end if;
  end if;
end $$;
