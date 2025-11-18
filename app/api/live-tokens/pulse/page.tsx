"use client";

import { useEffect, useState } from "react";

type PulseToken = {
  address: string;
  name: string;
  symbol: string;
  liquidityUsd: number;
  volume24h: number;
};

export default function PulsePage() {
  const [tokens, setTokens] = useState<PulseToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/live-tokens/pulse");
        const data = await res.json();
        setTokens(data);
      } catch (err) {
        console.error("Pulse page error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen p-6 text-slate-100">
      <h1 className="text-3xl font-bold mb-6">🔥 Live Token Pulse</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {tokens.map((t) => (
            <div key={t.address} className="border border-slate-700 p-4 rounded-lg">
              <p className="text-xl font-bold">{t.name} ({t.symbol})</p>
              <p className="text-sm text-slate-400 mt-1">Liquidity: ${t.liquidityUsd.toLocaleString()}</p>
              <p className="text-sm text-slate-400">24h Volume: ${t.volume24h.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
