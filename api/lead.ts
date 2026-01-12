import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Supabase client (server-side, service role)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Upstash rate limit (best-effort)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const ratelimit =
  redisUrl && redisToken
    ? new Ratelimit({
        redis: new Redis({ url: redisUrl, token: redisToken }),
        limiter: Ratelimit.slidingWindow(5, '60 s'), // 5 req / 60s / IP
        analytics: false,
        prefix: 'rl:lead',
      })
    : null;

function safeTrim(v: unknown, max: number) {
  const s = String(v ?? '').trim();
  return s.length > max ? s.slice(0, max) : s;
}

async function notifyTelegram(text: string) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });

    if (!r.ok) {
      const raw = await r.text().catch(() => '');
      console.error('Telegram notify failed:', r.status, raw.slice(0, 300));
    }
  } catch (e) {
    console.error('Telegram notify exception:', e);
  }
}

async function verifyTurnstile(token: string, remoteip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Misconfigured server; treat as hard fail
    return { ok: false, error: 'Turnstile not configured' as const };
  }

  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (remoteip) body.set('remoteip', remoteip);

  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const raw = await r.text();
  let data: any = null;
  try {
    data = JSON.parse(raw);
  } catch {
    return { ok: false, error: 'Turnstile invalid response' as const };
  }

  if (!r.ok || !data?.success) {
    return { ok: false, error: 'Turnstile failed' as const, codes: data?.['error-codes'] };
  }

  return { ok: true as const };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (mainly for local; Vercel prod typically doesn't need it)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { name, contact, reason, message, company, turnstileToken } = req.body ?? {};

    // IP Extraction
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      null;

    // Rate limit (best-effort). If not configured, skip.
    if (ratelimit && ip) {
      const rl = await ratelimit.limit(ip);
      if (!rl.success) {
        return res.status(429).json({ ok: false, error: 'Too many requests. Try again later.' });
      }
    }

    // Honeypot (bots) — pretend success, do nothing
    if (company) {
      return res.status(200).json({ ok: true });
    }

    // Turnstile required
    const ts = safeTrim(turnstileToken, 2048);
    if (!ts) {
      return res.status(400).json({ ok: false, error: 'Bot protection required' });
    }

    const verify = await verifyTurnstile(ts, ip);
    if (!verify.ok) {
      console.error('Turnstile verification failed:', verify);
      return res.status(403).json({ ok: false, error: 'Bot protection failed' });
    }

    // Normalize + clamp
    const n = safeTrim(name, 120);
    const c = safeTrim(contact, 180);
    const r = safeTrim(reason, 60);
    const m = safeTrim(message, 1200);

    // Validation
    if (!n || n.length < 2) return res.status(400).json({ ok: false, error: 'Invalid name' });
    if (!c || c.length < 3) return res.status(400).json({ ok: false, error: 'Invalid contact' });
    if (!r) return res.status(400).json({ ok: false, error: 'Reason required' });

    const userAgent = String(req.headers['user-agent'] || 'unknown');

    // DB Insert
    const { error } = await supabase.from('leads').insert({
      name: n,
      contact: c,
      reason: r,
      message: m || null,
      ip,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ ok: false, error: 'Database error' });
    }

    // Telegram notification (best-effort)
    const tgText = [
      '🆕 Новая заявка',
      `Имя: ${n}`,
      `Контакт: ${c}`,
      `Причина: ${r}`,
      m ? `Сообщение: ${m}` : null,
      ip ? `IP: ${ip}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    await notifyTelegram(tgText);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
