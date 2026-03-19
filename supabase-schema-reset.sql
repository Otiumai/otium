-- Otium Database Schema (RESET VERSION)
-- Drops everything first, then recreates. Safe to run multiple times.

-- ============================================================================
-- DROP EXISTING (in reverse dependency order)
-- ============================================================================

drop trigger if exists interests_updated_at on interests;
drop trigger if exists profiles_updated_at on profiles;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.update_updated_at();
drop function if exists public.handle_new_user();

drop table if exists course_tasks cascade;
drop table if exists course_weeks cascade;
drop table if exists courses cascade;
drop table if exists messages cascade;
drop table if exists interests cascade;
drop table if exists profiles cascade;

drop type if exists plan_type;
drop type if exists message_role;
drop type if exists task_type;

-- ============================================================================
-- ENUMS
-- ============================================================================

create type plan_type as enum ('free', 'pro');
create type message_role as enum ('user', 'assistant');
create type task_type as enum ('learn', 'practice', 'create', 'explore');

-- ============================================================================
-- TABLES
-- ============================================================================

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  plan plan_type not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  emoji text not null default '🌟',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_interests_user_id on interests(user_id);

create table messages (
  id uuid primary key default gen_random_uuid(),
  interest_id uuid not null references interests(id) on delete cascade,
  role message_role not null,
  content text not null default '',
  quick_replies jsonb,
  creators jsonb,
  course_update jsonb,
  created_at timestamptz not null default now()
);

create index idx_messages_interest_id on messages(interest_id);
create index idx_messages_created_at on messages(interest_id, created_at);

create table courses (
  id uuid primary key default gen_random_uuid(),
  interest_id uuid not null references interests(id) on delete cascade,
  title text not null,
  description text not null default '',
  total_weeks integer not null default 0,
  current_week integer not null default 1,
  created_at timestamptz not null default now()
);

create index idx_courses_interest_id on courses(interest_id);

create table course_weeks (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  week_number integer not null,
  title text not null,
  description text not null default '',
  unlocked boolean not null default false,
  resources jsonb,
  created_at timestamptz not null default now(),
  unique(course_id, week_number)
);

create index idx_course_weeks_course_id on course_weeks(course_id);

create table course_tasks (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references course_weeks(id) on delete cascade,
  task_id_client text not null,
  label text not null,
  description text,
  type task_type not null default 'learn',
  completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_course_tasks_week_id on course_tasks(week_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table profiles enable row level security;
alter table interests enable row level security;
alter table messages enable row level security;
alter table courses enable row level security;
alter table course_weeks enable row level security;
alter table course_tasks enable row level security;

create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

create policy "Users can view own interests" on interests for select using (auth.uid() = user_id);
create policy "Users can insert own interests" on interests for insert with check (auth.uid() = user_id);
create policy "Users can update own interests" on interests for update using (auth.uid() = user_id);
create policy "Users can delete own interests" on interests for delete using (auth.uid() = user_id);

create policy "Users can view own messages" on messages for select using (exists (select 1 from interests where interests.id = messages.interest_id and interests.user_id = auth.uid()));
create policy "Users can insert own messages" on messages for insert with check (exists (select 1 from interests where interests.id = messages.interest_id and interests.user_id = auth.uid()));
create policy "Users can update own messages" on messages for update using (exists (select 1 from interests where interests.id = messages.interest_id and interests.user_id = auth.uid()));
create policy "Users can delete own messages" on messages for delete using (exists (select 1 from interests where interests.id = messages.interest_id and interests.user_id = auth.uid()));

create policy "Users can view own courses" on courses for select using (exists (select 1 from interests where interests.id = courses.interest_id and interests.user_id = auth.uid()));
create policy "Users can insert own courses" on courses for insert with check (exists (select 1 from interests where interests.id = courses.interest_id and interests.user_id = auth.uid()));
create policy "Users can update own courses" on courses for update using (exists (select 1 from interests where interests.id = courses.interest_id and interests.user_id = auth.uid()));
create policy "Users can delete own courses" on courses for delete using (exists (select 1 from interests where interests.id = courses.interest_id and interests.user_id = auth.uid()));

create policy "Users can view own course weeks" on course_weeks for select using (exists (select 1 from courses join interests on interests.id = courses.interest_id where courses.id = course_weeks.course_id and interests.user_id = auth.uid()));
create policy "Users can insert own course weeks" on course_weeks for insert with check (exists (select 1 from courses join interests on interests.id = courses.interest_id where courses.id = course_weeks.course_id and interests.user_id = auth.uid()));
create policy "Users can update own course weeks" on course_weeks for update using (exists (select 1 from courses join interests on interests.id = courses.interest_id where courses.id = course_weeks.course_id and interests.user_id = auth.uid()));
create policy "Users can delete own course weeks" on course_weeks for delete using (exists (select 1 from courses join interests on interests.id = courses.interest_id where courses.id = course_weeks.course_id and interests.user_id = auth.uid()));

create policy "Users can view own course tasks" on course_tasks for select using (exists (select 1 from course_weeks join courses on courses.id = course_weeks.course_id join interests on interests.id = courses.interest_id where course_weeks.id = course_tasks.week_id and interests.user_id = auth.uid()));
create policy "Users can insert own course tasks" on course_tasks for insert with check (exists (select 1 from course_weeks join courses on courses.id = course_weeks.course_id join interests on interests.id = courses.interest_id where course_weeks.id = course_tasks.week_id and interests.user_id = auth.uid()));
create policy "Users can update own course tasks" on course_tasks for update using (exists (select 1 from course_weeks join courses on courses.id = course_weeks.course_id join interests on interests.id = courses.interest_id where course_weeks.id = course_tasks.week_id and interests.user_id = auth.uid()));
create policy "Users can delete own course tasks" on course_tasks for delete using (exists (select 1 from course_weeks join courses on courses.id = course_weeks.course_id join interests on interests.id = courses.interest_id where course_weeks.id = course_tasks.week_id and interests.user_id = auth.uid()));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure public.update_updated_at();

create trigger interests_updated_at
  before update on interests
  for each row execute procedure public.update_updated_at();
