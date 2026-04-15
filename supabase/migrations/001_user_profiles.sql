-- 用户旅行档案表
-- 存储用户偏好：国籍、语言、目的城市、预算、兴趣等

create table if not exists public.user_profiles (
  user_id          text        primary key,
  nationality      text        not null default '',
  languages        text[]      not null default '{"en-US"}',
  planned_cities   text[]      not null default '{}',
  budget           text        not null default 'mid'
                               check (budget in ('budget', 'mid', 'luxury')),
  interests        text[]      not null default '{}',
  food_restrictions text[]     not null default '{}',
  visit_purpose    text        not null default 'tourism'
                               check (visit_purpose in ('tourism', 'business', 'study', 'other')),
  completed_steps  jsonb       not null default '{"visa":false,"payment":false,"sim":false,"vpn":false,"accommodation":false}',
  onboarding_done  boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 自动更新 updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- RLS: 用户只能读写自己的档案
alter table public.user_profiles enable row level security;

drop policy if exists "users can read own profile" on public.user_profiles;
create policy "users can read own profile"
  on public.user_profiles for select
  using (auth.uid()::text = user_id);

drop policy if exists "users can upsert own profile" on public.user_profiles;
create policy "users can upsert own profile"
  on public.user_profiles for all
  using (auth.uid()::text = user_id)
  with check (auth.uid()::text = user_id);
