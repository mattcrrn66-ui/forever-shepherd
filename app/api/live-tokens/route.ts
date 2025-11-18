// app/api/live-tokens/route.ts
import { NextResponse } from "next/server";

type LiveToken = {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string | null;
  volume24h: number | null;
  liquidityUsd: number | null;
  url: string | null;
  imageUrl: string | null;
  website: string | null;
  socials: { platform: string; handle: string }[];
};

export async function GET() {
  try {
    // Fetch all Solana pairs
    const res = await fetch(
      "https://api.dexscreener.com/latest/dex/pairs/solana",
      {
        next: { revalidate: 30 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Solana tokens" },
        { status: 500 }
      );
    }

    const body = await res.json();
    const pairs: any[] = Array.isArray(body.pairs) ? body.pairs : [];

    // Map Dexscreener -> our LiveToken format
    const mapped: LiveToken[] = pairs.map((p) => ({
      id: p.pairAddress,
      name: p.baseToken?.name ?? "Unknown",
      symbol: p.baseToken?.symbol ?? "",
      priceUsd: p.priceUsd ?? null,
      volume24h: p.volume?.h24 ?? null,
      liquidityUsd: p.liquidity?.usd ?? null,
      url: p.url ?? null,
      imageUrl: p.info?.imageUrl ?? null,
      website: p.info?.websites?.[0]?.url ?? null,
      socials: p.info?.socials ?? [],
    }));

    // Sort with explicit types so TS shuts up
    mapped.sort(
      (a: LiveToken, b: LiveToken) =>
        (b.liquidityUsd ?? 0) - (a.liquidityUsd ?? 0)
    );

    // Top 50
    const top50 = mapped.slice(0, 50);

    return NextResponse.json(top50);
  } catch (err) {
    console.error("live-tokens API error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
