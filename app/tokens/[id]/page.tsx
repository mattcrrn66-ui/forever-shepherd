// app/tokens/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import TokenPortal from "@/components/TokenPortal";

type Token = {
  id: string;
  name: string;
  symbol: string;
  description: string | null;
  image_url: string | null;
  telegram_url: string | null;
  x_url: string | null;
  website_url: string | null;
  created_at: string;
};

const supabase = createClient();

export default function TokenPage() {
  const params = useParams();
  const rawId = params?.id as string | string[] | undefined;

  const tokenId =
    typeof rawId === "string"
      ? decodeURIComponent(rawId)
      : Array.isArray(rawId)
      ? decodeURIComponent(rawId[0])
      : "";

  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (!tokenId) {
        setError("Missing token id in URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("tokens")
        .select("*")
        .eq("id", tokenId)
        .single();

      if (error || !data) {
        console.error("Error fetching token", error);
        setError(error?.message || "Token not found.");
        setToken(null);
      } else {
        setToken(data as Token);
      }

      setLoading(false);
    };

    fetchToken();
  }, [tokenId]);

  if (loading) {
    return (
      <main className="min-h-screen cyber-page flex items-center justify-center">
        <p className="text-sm text-slate-300 animate-pulse">
          Loading token portal…
        </p>
      </main>
    );
  }

  if (error || !token) {
    return (
      <main className="min-h-screen cyber-page flex items-center justify-center text-slate-50">
        <div className="text-center space-y-3 max-w-md px-4">
          <p className="text-lg font-semibold">Token not found.</p>
          <p className="text-xs text-slate-400">
            {error
              ? `Supabase says: ${error}`
              : "The portal couldn't find a token with this id."}
          </p>
          <Link
            href="/dev-hub"
            className="text-sm text-cyan-400 hover:text-cyan-300 underline"
          >
            ← Back to Cyber Dev Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen cyber-page text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="text-sm flex items-center gap-2 text-slate-400">
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            ← Cyber Dev Hub
          </Link>
          <span className="text-slate-600">/</span>
          <Link
            href="/directory"
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Directory
          </Link>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-xs text-cyan-300">
            {token.symbol}
          </span>
        </div>

        {/* Token header */}
        <section className="border border-slate-800 rounded-2xl p-4 sm:p-6 bg-slate-900/70 cyber-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 mb-1">
              Cyber Dev Token • Portal
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 flex items-center gap-2">
              <span>{token.name}</span>
              <span className="text-cyan-300 text-base sm:text-lg">
                ({token.symbol})
              </span>
            </h1>
            {token.description && (
              <p className="text-slate-300 text-sm sm:text-base max-w-xl">
                {token.description}
              </p>
            )}
          </div>

          {token.image_url && (
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="rounded-3xl border border-cyan-500/40 p-[2px] shadow-[0_0_35px_rgba(34,211,238,0.45)]">
                <img
                  src={token.image_url}
                  alt={token.name || ""}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-slate-700 object-cover"
                />
              </div>
            </div>
          )}
        </section>

        {/* Links */}
        <section className="border border-slate-800 rounded-2xl p-4 sm:p-6 bg-slate-900/70 cyber-card">
          <h2 className="text-lg font-semibold mb-3">Links</h2>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            {token.website_url && (
              <a
                href={token.website_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/70 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_16px_rgba(34,211,238,0.45)] transition"
              >
                Website
              </a>
            )}
            {token.x_url && (
              <a
                href={token.x_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/70 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_16px_rgba(34,211,238,0.45)] transition"
              >
                X (Twitter)
              </a>
            )}
            {token.telegram_url && (
              <a
                href={token.telegram_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/70 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_16px_rgba(34,211,238,0.45)] transition"
              >
                Telegram
              </a>
            )}
            {!token.website_url && !token.x_url && !token.telegram_url && (
              <p className="text-slate-500 text-sm">
                No links have been added for this token yet.
              </p>
            )}
          </div>
        </section>

        {/* Community Portal (message board) */}
        <TokenPortal
          tokenId={token.id}
          name={token.name}
          symbol={token.symbol}
        />
      </div>
    </main>
  );
}
