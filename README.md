# Club Play — Premium Gaming Community Landing

**Live Demo:** https://game-land-x77l.vercel.app

Modern landing page for a premium gaming community with a secure serverless lead capture flow.
Built as a **portfolio demo project** to demonstrate production-ready frontend + backend skills.

---

## Overview

This project represents a real-world landing page with:
- application-based onboarding,
- bot and spam protection,
- server-side validation,
- real database storage,
- instant admin notifications.

The goal is not just UI, but a **complete, deployable product**.

---

## Features

- Modern, clean UI (product-style, 2026 look)
- Mobile-first responsive layout
- Application form (no open registration)
- Bot & spam protection:
  - Cloudflare Turnstile
  - Rate limiting (Upstash Redis)
  - Honeypot field
- Serverless backend (Vercel)
- Supabase (PostgreSQL) storage
- Telegram notifications on new leads
- Production deployment

---

## Tech Stack

**Frontend**
- Vite
- React
- TypeScript
- Tailwind CSS

**Backend**
- Vercel Serverless Functions
- Supabase (PostgreSQL)

**Security**
- Cloudflare Turnstile
- Upstash Redis (rate limiting)
- Server-side validation
- Service Role isolation

**Infrastructure**
- Vercel (CI/CD, hosting)
- GitHub

---

## Architecture

```text
User
 └─> Landing Page (React + Vite)
      └─> Turnstile verification
           └─> /api/lead (Vercel Function)
                ├─> Rate limit (Upstash)
                ├─> Supabase insert
                └─> Telegram notification

--- 

## Screenshots

### Home / FAQ
![FAQ](docs/screens/01-faq.png)

### Forms
![Forms](docs/screens/02-forms.png)

### FormsReady
![FormsReady](docs/screens/03-formsready.png)

### Home
![Home](docs/screens/home.png)

### TG
![TG](docs/screens/TG.png)


## Local Development

```bash
npm install
npm run dev

Create .env.local:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

VITE_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

---

### ✅ Supabase Setup

```md
## Supabase Setup

Run in Supabase SQL Editor:

```sql
create extension if not exists pgcrypto;

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
No public insert policies
Writes are allowed only via serverless functions (service role)


---

### ✅ Deployment

```md
## Deployment

- GitHub repository connected to Vercel
- Automatic CI/CD on push
- Environment variables configured per environment

Production URL:
https://game-land-x77l.vercel.app

## What I Did

- Designed a modern product-style UI
- Built a secure serverless backend for lead capture
- Implemented bot protection and rate limiting
- Integrated Supabase database
- Added Telegram notifications for new leads
- Deployed and configured production infrastructure

## Status

- Production-ready
- Portfolio demo project
- Ready for extension into a full web application or SaaS
