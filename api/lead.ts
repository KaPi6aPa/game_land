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
    const { name, contact, reason, message, company } = req.body;

    // Honeypot check
    if (company) {
      // Silently fail for bots
      return res.status(200).json({ ok: true });
    }

    // Validation
    if (!name || name.length < 2 || name.length > 120) {
      return res.status(400).json({ ok: false, error: 'Invalid name' });
    }
    if (!contact || contact.length < 3 || contact.length > 180) {
      return res.status(400).json({ ok: false, error: 'Invalid contact' });
    }
    if (!reason || reason.length > 60) {
      return res.status(400).json({ ok: false, error: 'Reason required' });
    }
    if (message && message.length > 1200) {
      return res.status(400).json({ ok: false, error: 'Message too long' });
    }

    // IP Extraction
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'unknown';

    // DB Insert
    const { error } = await supabase.from('leads').insert({
      name,
      contact,
      reason,
      message,
      ip,
      user_agent: userAgent,
    });

    if (error) {
      console.error('Supabase Error:', error);
      // Return generic error to client
      return res.status(500).json({ ok: false, error: 'Database error' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}