-- ============================================================
-- Excuse Caddie — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Excuses table
create table if not exists excuses (
  id uuid default gen_random_uuid() primary key,
  text text not null unique,
  category text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. Votes table
create table if not exists excuse_votes (
  id uuid default gen_random_uuid() primary key,
  excuse_id uuid references excuses(id) on delete cascade not null,
  device_id text not null,
  created_at timestamptz default now(),
  unique(excuse_id, device_id)  -- 1 vote per device per excuse
);

-- 3. User submissions table
create table if not exists excuse_submissions (
  id uuid default gen_random_uuid() primary key,
  text text not null,
  device_id text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_excuses_category on excuses(category);
create index if not exists idx_excuses_active on excuses(is_active);
create index if not exists idx_votes_excuse on excuse_votes(excuse_id);
create index if not exists idx_votes_created on excuse_votes(created_at);
create index if not exists idx_submissions_status on excuse_submissions(status);
create index if not exists idx_submissions_device on excuse_submissions(device_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Excuses: anyone can read, no one can write from client
alter table excuses enable row level security;
create policy "Excuses are publicly readable"
  on excuses for select
  using (is_active = true);

-- Votes: anyone can read and insert (1 per device enforced by unique constraint)
alter table excuse_votes enable row level security;
create policy "Votes are publicly readable"
  on excuse_votes for select
  using (true);
create policy "Anyone can vote"
  on excuse_votes for insert
  with check (true);

-- Submissions: anyone can insert (rate-limited by DB function), devices can only read their own
alter table excuse_submissions enable row level security;
create policy "Anyone can submit"
  on excuse_submissions for insert
  with check (true);
create policy "Devices can read own submissions"
  on excuse_submissions for select
  using (device_id = current_setting('request.headers', true)::json->>'x-device-id');

-- ============================================================
-- Server-side rate limit for submissions (max 3 per device per day)
-- ============================================================
create or replace function check_submission_rate_limit()
  returns trigger as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from excuse_submissions
  where device_id = NEW.device_id
    and created_at > now() - interval '24 hours';
  if recent_count >= 3 then
    raise exception 'Rate limit exceeded: max 3 submissions per day'
      using errcode = 'P0001';
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger enforce_submission_rate_limit
  before insert on excuse_submissions
  for each row execute function check_submission_rate_limit();

-- ============================================================
-- Leaderboard view (convenience)
-- ============================================================
create or replace view leaderboard_all_time as
  select
    e.id,
    e.text,
    e.category,
    count(v.id) as votes
  from excuses e
  left join excuse_votes v on v.excuse_id = e.id
  where e.is_active = true
  group by e.id, e.text, e.category
  order by votes desc;

create or replace view leaderboard_weekly as
  select
    e.id,
    e.text,
    e.category,
    count(v.id) as votes
  from excuses e
  left join excuse_votes v on v.excuse_id = e.id
    and v.created_at > now() - interval '7 days'
  where e.is_active = true
  group by e.id, e.text, e.category
  order by votes desc;

create or replace view leaderboard_monthly as
  select
    e.id,
    e.text,
    e.category,
    count(v.id) as votes
  from excuses e
  left join excuse_votes v on v.excuse_id = e.id
    and v.created_at > now() - interval '30 days'
  where e.is_active = true
  group by e.id, e.text, e.category
  order by votes desc;
