import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceResult {
  symbol: string;
  price: number;
  dailyChange: number;
  dailyChangePercent: number;
  updatedAt: string;
}

function toYahooSymbol(symbol: string): string {
  const upper = symbol.toUpperCase();
  if (upper.includes('=') || upper.includes('^') || upper.includes('.') || upper.includes('-')) {
    return upper;
  }
  return `${upper}.IS`;
}

async function fetchYahooPrice(symbol: string): Promise<PriceResult | null> {
  const normalized = symbol.toUpperCase();
  const yahooSymbol = toYahooSymbol(normalized);
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1d&includePrePost=false`;

  const resp = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WealthTracker/1.0)' },
  });

  if (!resp.ok) return null;

  const data = await resp.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) return null;

  const price: number = meta.regularMarketPrice ?? 0;
  const prevClose: number = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const dailyChange = price - prevClose;
  const dailyChangePercent = prevClose > 0 ? (dailyChange / prevClose) * 100 : 0;

  return {
    symbol: normalized,
    price,
    dailyChange,
    dailyChangePercent,
    updatedAt: new Date().toISOString(),
  };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS });
  }

  try {
    const { symbols } = await req.json() as { symbols: string[] };

    if (!Array.isArray(symbols) || symbols.length === 0) {
      return new Response(JSON.stringify({ error: 'symbols array required' }), {
        status: 400,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const results = await Promise.allSettled(symbols.map(fetchYahooPrice));

    const prices: Record<string, PriceResult> = {};
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value) {
        prices[symbols[i].toUpperCase()] = r.value;
      }
    });

    return new Response(JSON.stringify(prices), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
