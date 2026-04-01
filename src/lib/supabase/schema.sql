-- Create Registrations Table
create table if not exists public.registrations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text not null, -- 'Student', 'Public', 'Alumni'
  gender text,
  phone text,
  status text, -- 'Single', etc.
  transport text,
  student_id text,
  year text,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  has_entry_pass boolean default true
);

-- Enable RLS
alter table public.registrations enable row level security;

-- Create Lost Items Table
create table if not exists public.lost_items (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  location text,
  image_url text,
  found_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_claimed boolean default false,
  contact_info text,
  created_by uuid references auth.users(id) -- Optional: link to admin user
);

-- Enable RLS
alter table public.lost_items enable row level security;

-- Policies for Registrations

-- 1. Allow authenticated insert
drop policy if exists "Enable insert for authenticated users only" on public.registrations;
create policy "Enable insert for authenticated users only" 
on public.registrations for insert 
with check (true);

-- 2. Allow anon insert
drop policy if exists "Enable insert for anon users only" on public.registrations;
create policy "Enable insert for anon users only" 
on public.registrations for insert 
with check (true);

-- Policies for Lost Items

-- 1. Public read access
drop policy if exists "Public items are viewable by everyone." on public.lost_items;
create policy "Public items are viewable by everyone."
  on public.lost_items for select
  using ( true );

-- 2. Allow anon insert (Admin protected by frontend)
drop policy if exists "Enable insert for anon users only" on public.lost_items;
create policy "Enable insert for anon users only" 
on public.lost_items for insert 
with check (true);

-- 3. Allow anon update (Admin protected by frontend)
drop policy if exists "Enable update for anon users" on public.lost_items;
create policy "Enable update for anon users"
  on public.lost_items for update
  using (true)
  with check (true);

-- 4. Allow anon delete (Admin protected by frontend)
drop policy if exists "Enable delete for anon users" on public.lost_items;
create policy "Enable delete for anon users"
  on public.lost_items for delete
  using (true);

-- CRITICAL: Grant permissions to roles (Fix for 42501)
grant usage on schema public to anon, authenticated;
grant all on table public.registrations to anon, authenticated;
grant all on table public.lost_items to anon, authenticated;
