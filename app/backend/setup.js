/**
 * Setup script — creates tables, RLS policies, views, and seeds excuses.
 * Usage: node backend/setup.js
 */
require('dotenv').config();
const { Client } = require('pg');
const { EXCUSES } = require('../src/excuses');

const client = new Client({
  host: process.env.SUPABASE_DB_HOST || 'aws-0-eu-north-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: process.env.SUPABASE_DB_USER || 'postgres.visaozobhupplycvrvst',
  password: process.env.SUPABASE_DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase Postgres.');

  // 1. Create tables
  console.log('Creating tables...');
  await client.query(`
    create table if not exists excuses (
      id uuid default gen_random_uuid() primary key,
      text text not null unique,
      category text not null,
      is_active boolean default true,
      created_at timestamptz default now()
    );
  `);
  await client.query(`
    create table if not exists excuse_votes (
      id uuid default gen_random_uuid() primary key,
      excuse_id uuid references excuses(id) on delete cascade not null,
      device_id text not null,
      created_at timestamptz default now(),
      unique(excuse_id, device_id)
    );
  `);
  await client.query(`
    create table if not exists excuse_submissions (
      id uuid default gen_random_uuid() primary key,
      text text not null,
      device_id text not null,
      status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
      created_at timestamptz default now(),
      reviewed_at timestamptz
    );
  `);
  console.log('Tables created.');

  // 2. Indexes
  console.log('Creating indexes...');
  await client.query(`create index if not exists idx_excuses_category on excuses(category);`);
  await client.query(`create index if not exists idx_excuses_active on excuses(is_active);`);
  await client.query(`create index if not exists idx_votes_excuse on excuse_votes(excuse_id);`);
  await client.query(`create index if not exists idx_votes_created on excuse_votes(created_at);`);
  await client.query(`create index if not exists idx_submissions_status on excuse_submissions(status);`);
  await client.query(`create index if not exists idx_submissions_device on excuse_submissions(device_id);`);
  console.log('Indexes created.');

  // 3. RLS
  console.log('Setting up RLS...');
  for (const table of ['excuses', 'excuse_votes', 'excuse_submissions']) {
    await client.query(`alter table ${table} enable row level security;`);
  }

  // Drop existing policies to avoid errors on re-run
  const policies = [
    ['excuses', 'Excuses are publicly readable'],
    ['excuse_votes', 'Votes are publicly readable'],
    ['excuse_votes', 'Anyone can vote'],
    ['excuse_submissions', 'Anyone can submit'],
    ['excuse_submissions', 'Devices can read own submissions'],
  ];
  for (const [table, name] of policies) {
    await client.query(`drop policy if exists "${name}" on ${table};`);
  }

  await client.query(`create policy "Excuses are publicly readable" on excuses for select using (is_active = true);`);
  await client.query(`create policy "Votes are publicly readable" on excuse_votes for select using (true);`);
  await client.query(`create policy "Anyone can vote" on excuse_votes for insert with check (true);`);
  await client.query(`create policy "Anyone can submit" on excuse_submissions for insert with check (true);`);
  await client.query(`create policy "Devices can read own submissions" on excuse_submissions for select using (device_id = current_setting('request.headers', true)::json->>'x-device-id');`);
  console.log('RLS policies set.');

  // Server-side rate limit for submissions
  await client.query(`
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
  `);
  await client.query(`drop trigger if exists enforce_submission_rate_limit on excuse_submissions;`);
  await client.query(`create trigger enforce_submission_rate_limit before insert on excuse_submissions for each row execute function check_submission_rate_limit();`);
  console.log('Rate limit trigger set.');

  // 4. Leaderboard views
  console.log('Creating leaderboard views...');
  await client.query(`
    create or replace view leaderboard_all_time as
      select e.id, e.text, e.category, count(v.id)::int as votes
      from excuses e
      left join excuse_votes v on v.excuse_id = e.id
      where e.is_active = true
      group by e.id, e.text, e.category
      order by votes desc;
  `);
  await client.query(`
    create or replace view leaderboard_weekly as
      select e.id, e.text, e.category, count(v.id)::int as votes
      from excuses e
      left join excuse_votes v on v.excuse_id = e.id and v.created_at > now() - interval '7 days'
      where e.is_active = true
      group by e.id, e.text, e.category
      order by votes desc;
  `);
  await client.query(`
    create or replace view leaderboard_monthly as
      select e.id, e.text, e.category, count(v.id)::int as votes
      from excuses e
      left join excuse_votes v on v.excuse_id = e.id and v.created_at > now() - interval '30 days'
      where e.is_active = true
      group by e.id, e.text, e.category
      order by votes desc;
  `);
  console.log('Leaderboard views created.');

  // 5. Seed excuses
  console.log(`Seeding ${EXCUSES.length} excuses...`);
  let inserted = 0;
  let skipped = 0;
  for (const e of EXCUSES) {
    try {
      await client.query(
        `insert into excuses (text, category) values ($1, $2) on conflict (text) do nothing`,
        [e.text, e.tags[0]]
      );
      inserted++;
    } catch (err) {
      skipped++;
      console.warn(`  Skipped: ${e.text.substring(0, 50)}... (${err.message})`);
    }
  }
  console.log(`Seeded: ${inserted} inserted, ${skipped} skipped.`);

  // 6. Verify
  const { rows } = await client.query('select count(*)::int as total from excuses');
  console.log(`Total excuses in database: ${rows[0].total}`);

  const cats = await client.query('select category, count(*)::int as n from excuses group by category order by n desc');
  console.log('Per category:');
  for (const r of cats.rows) {
    console.log(`  ${r.category}: ${r.n}`);
  }

  await client.end();
  console.log('\nDone! Backend is ready.');
}

run().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
