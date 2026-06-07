import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const { codes } = await req.json() as { codes: string[] };

    if (!codes || codes.length === 0) {
      return new Response(JSON.stringify({ prices: {} }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('FONOLOJI_API_KEY');
    if (!apiKey) throw new Error('FONOLOJI_API_KEY secret is not set');

    const results = await Promise.all(
      codes.map(async (code) => {
        const res = await fetch(`https://fonoloji.com/v1/funds/${code}`, {
          headers: { 'X-API-Key': apiKey },
        });
        if (!res.ok) return { code, error: `HTTP ${res.status}` };
        const data = await res.json();
        return {
          code,
          price: data.fund?.current_price ?? null,
          dailyChangePercent: data.fund?.return_1d != null
            ? data.fund.return_1d * 100
            : null,
          updatedAt: data.fund?.current_date ?? null,
        };
      }),
    );

    const prices: Record<string, { price: number; dailyChangePercent: number | null; updatedAt: string | null }> = {};
    for (const r of results) {
      if (!('error' in r) && r.price !== null) {
        prices[r.code] = {
          price: r.price,
          dailyChangePercent: r.dailyChangePercent,
          updatedAt: r.updatedAt,
        };
      }
    }

    return new Response(JSON.stringify({ prices }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
