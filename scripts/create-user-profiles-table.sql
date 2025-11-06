-- Create user profiles table for Stripe subscription management
-- This table links Supabase auth users with Stripe customers and subscription data

create table public.plik_user_profiles (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  email text not null,
  full_name text null,
  stripe_customer_id text null,
  stripe_subscription_id text null,
  subscription_status text null default 'inactive'::text,
  subscription_plan text null,
  subscription_start_date timestamp with time zone null,
  subscription_end_date timestamp with time zone null,
  trial_end_date timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_profiles_pkey primary key (id),
  constraint user_profiles_email_key unique (email),
  constraint user_profiles_stripe_customer_id_key unique (stripe_customer_id),
  constraint user_profiles_user_id_key unique (user_id),
  constraint user_profiles_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
) tablespace pg_default;

-- Create indexes for better query performance
create index if not exists idx_user_profiles_user_id on public.plik_user_profiles using btree (user_id) tablespace pg_default;
create index if not exists idx_user_profiles_email on public.plik_user_profiles using btree (email) tablespace pg_default;
create index if not exists idx_user_profiles_stripe_customer_id on public.plik_user_profiles using btree (stripe_customer_id) tablespace pg_default;
create index if not exists idx_user_profiles_subscription_status on public.plik_user_profiles using btree (subscription_status) tablespace pg_default;

-- Enable Row Level Security
alter table public.plik_user_profiles enable row level security;

-- Create policies for RLS
-- Users can only see and modify their own profile
create policy "Users can view own profile" on public.plik_user_profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.plik_user_profiles
  for update using (auth.uid() = user_id);

create policy "Users can insert own profile" on public.plik_user_profiles
  for insert with check (auth.uid() = user_id);

-- Create function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.plik_user_profiles (user_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (user_id) do update set email = excluded.email, full_name = excluded.full_name;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile when user signs up
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_user_profiles_updated_at
  before update on public.plik_user_profiles
  for each row execute procedure public.update_updated_at_column();
