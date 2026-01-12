# Club Play - Premium Gaming Community

A modern landing page with serverless lead capture.

## Setup

1. `npm install`
2. Create `.env.local` with Supabase credentials (see below).
3. `npm run dev`

## Supabase Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create table
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  reason text not null,
  message text null,
  source text not null default 'landing',
  user_agent text null,
  ip text null
);

-- Enable RLS
alter table public.leads enable row level security;

-- Create policy: NO public access (server uses service role)
-- Do not add any 'create policy ... for insert to public' lines.
```

## Environment Variables (.env.local & Vercel)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Security Note:** Never use the `SUPABASE_SERVICE_ROLE_KEY` in the client-side code (Vite). It is only used in `api/lead.ts`.
