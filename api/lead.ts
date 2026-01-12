import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Supabase client
// Service role key is used to bypass RLS policies for insertion
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

function safeTrim(v: unknown, max: number) {
  const s = String(v ?? '').trim();
  return s.length > max ? s.slice(0, max) : s;
}

async function notifyTelegram(text: string) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;

  // If not configured - silently skip
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

    // don't fail the whole request because of Telegram
    if (!r.ok) {
      const raw = await r.text().catch(() => '');
      console.error('Telegram notify failed:', r.status, raw.slice(0, 300));
    }
  } catch (e) {
    console.error('Telegram notify exception:', e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Handling (for local dev mostly, Vercel handles prod typically)
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
    const { name, contact, reason, message, company } = req.body ?? {};

    // Honeypot check
    if (company) {
      // Silently succeed for bots
      return res.status(200).json({ ok: true });
    }

    // Normalize + clamp
    const n = safeTrim(name, 120);
    const c = safeTrim(contact, 180);
    const r = safeTrim(reason, 60);
    const m = safeTrim(message, 1200);

    // Validation
    if (!n || n.length < 2) {
      return res.status(400).json({ ok: false, error: 'Invalid name' });
    }
    if (!c || c.length < 3) {
      return res.status(400).json({ ok: false, error: 'Invalid contact' });
    }
    if (!r) {
      return res.status(400).json({ ok: false, error: 'Reason required' });
    }

    // IP Extraction
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      null;

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

    // Telegram notification (best-effort, does not affect client success)
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
