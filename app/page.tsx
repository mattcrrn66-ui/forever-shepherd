"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const supabase = createClient();

type TokenRow = {
  id: string;
  name: string | null;
  symbol: string | null;
  description: string | null;
  image_url: string | null;
  telegram_url: string | null;
  x_url: string | null;
  website_url: string | null;
  created_at: string | null;
};

type LiveToken = {
  id: string;
  url: string;
  chainId: string;
  name: string;
  symbol: string;
  priceUsd: string | null;
  volume24h: number | null;
  liquidityUsd: number | null;
  imageUrl: string | null;
  website: string | null;
  socials: { platform: string; handle: string }[];
};

type EnrichedToken = TokenRow & {
  heatScore: number;
  mergedLive?: LiveToken | null;
};

type SortMode = "recent" | "heat";

export default function HomeTokenWatchPage() {
  // Hub tokens (Supabase)
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  // Live market feed (Dexscreener)
  const [liveTokens, setLiveTokens] = useState<LiveToken[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);

  // Filters + UI state
  const [search, setSearch] = useState("");
  const [onlyWithLinks, setOnlyWithLinks] = useState(false);
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  // Local watchlist (ids of hub tokens)
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // ---- Load watchlist from localStorage ----
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem("cdt_watchlist");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setWatchlist(parsed);
        }
      }
    } catch {
      // ignore bad JSON
    }
  }, []);

  function persistWatchlist(next: string[]) {
    setWatchlist(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cdt_watchlist", JSON.stringify(next));
    }
  }

  function toggleWatch(id: string) {
    persistWatchlist(
      watchlist.includes(id)
        ? watchlist.filter((x) => x !== id)
        : [...watchlist, id]
    );
  }

  // ---- Supabase: initial fetch ----
  async function fetchTokens() {
    try {
      setLoadingTokens(true);
      setStatus(null);

      const { data, error } = await supabase
        .from("tokens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error(error);
        setStatus("Error loading hub tokens: " + error.message);
        setTokens([]);
        return;
      }

      setTokens((data as TokenRow[]) || []);
      if (!data || data.length === 0) {
        setStatus("No hub tokens yet. Builders are still waking up.");
      }
    } finally {
      setLoadingTokens(false);
    }
  }

  // ---- Supabase Realtime: listen to inserts/updates/deletes ----
  useEffect(() => {
    fetchTokens();

    const channel = supabase
      .channel("tokens-watchboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tokens" },
        () => {
          // simple strategy: refetch
          fetchTokens();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Dexscreener: fetch live feed (via our API route) ----
  async function fetchLiveTokens() {
    try {
      setLoadingLive(true);
      setLiveError(null);

      const res = await fetch("/api/live-tokens");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setLiveError(body.error || "Failed to load live tokens.");
        setLiveTokens([]);
        return;
      }

      const data = (await res.json()) as LiveToken[];
      setLiveTokens(data || []);
    } catch (err) {
      console.error("fetchLiveTokens error:", err);
      setLiveError("Unexpected error loading live tokens.");
      setLiveTokens([]);
    } finally {
      setLoadingLive(false);
    }
  }

  useEffect(() => {
    fetchLiveTokens();
  }, []);

  // ---- Build a quick lookup for live tokens by symbol ----
  const liveBySymbol = useMemo(() => {
    const map: Record<string, LiveToken> = {};
    for (const lt of liveTokens) {
      if (!lt.symbol) continue;
      map[lt.symbol.toUpperCase()] = lt;
    }
    return map;
  }, [liveTokens]);

  // ---- Compute a "heat score" for each builder token ----
  function computeHeatScore(t: TokenRow, mergedLive?: LiveToken | null) {
    let score = 0;

    // metadata completeness
    if (t.image_url) score += 12;
    if (t.telegram_url) score += 6;
    if (t.x_url) score += 6;
    if (t.website_url) score += 6;

    // newer tokens get a small boost
    if (t.created_at) {
      const created = new Date(t.created_at).getTime();
      const ageHours =
        (Date.now() - created) / (1000 * 60 * 60); // hours
      if (!Number.isNaN(ageHours)) {
        if (ageHours < 1) score += 10;
        else if (ageHours < 24) score += 6;
        else if (ageHours < 72) score += 3;
      }
    }

    // tie in live market data if symbol matches
    if (mergedLive) {
      const vol = mergedLive.volume24h ?? 0;
      const liq = mergedLive.liquidityUsd ?? 0;

      if (vol > 0) {
        score += Math.min(20, Math.log10(vol + 1) * 4);
      }
      if (liq > 0) {
        score += Math.min(20, Math.log10(liq + 1) * 4);
      }
    }

    return Math.round(score);
  }

  // ---- Enrich builder tokens with heat + merged live data ----
  const enrichedTokens: EnrichedToken[] = useMemo(() => {
    return tokens.map((t) => {
      const sym = (t.symbol || "").toUpperCase();
      const mergedLive = sym ? liveBySymbol[sym] : undefined;
      const heatScore = computeHeatScore(t, mergedLive);
      return { ...t, heatScore, mergedLive: mergedLive ?? null };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, liveBySymbol]);

  // ---- Apply search + filters + sort ----
  const normalizedSearch = search.trim().toLowerCase();

  const filteredAndSortedTokens = useMemo(() => {
    let list = enrichedTokens.filter((t) => {
      if (onlyWithLinks) {
        const hasLink = !!(t.telegram_url || t.x_url || t.website_url);
        if (!hasLink) return false;
      }

      if (onlyWatchlist) {
        if (!watchlist.includes(t.id)) return false;
      }

      if (!normalizedSearch) return true;

      const name = (t.name || "").toLowerCase();
      const symbol = (t.symbol || "").toLowerCase();
      return (
        name.includes(normalizedSearch) ||
        symbol.includes(normalizedSearch)
      );
    });

    if (sortMode === "heat") {
      list = [...list].sort((a, b) => b.heatScore - a.heatScore);
    } else {
      // recent: sort by created_at desc (fallback to current order)
      list = [...list].sort((a, b) => {
        const aTime = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;
        const bTime = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;
        return bTime - aTime;
      });
    }

    return list;
  }, [
    enrichedTokens,
    onlyWithLinks,
    onlyWatchlist,
    normalizedSearch,
    sortMode,
    watchlist,
  ]);

  // ---------------------------------------------------------------------------

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0f172a, #020617)",
        padding: 24,
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          margin: "0 auto",
          maxWidth: 1200,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* HEADER */}
        <header style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p
            style={{
              fontSize: 10,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#22d3ee",
            }}
          >
            Cyber Dev Token • $CDT
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 700 }}>
            Token Watchboard — Builder Hub + Live Feed
          </h1>
          <p style={{ fontSize: 14, color: "#9ca3af", maxWidth: 600 }}>
            Top layer: tokens registered through the Cyber Dev builder. Below
            that: live Solana pairs pulled directly from on-chain markets.
          </p>

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <Link
              href="/build"
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                border: "1px solid rgba(34,211,238,0.6)",
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 500,
                color: "#a5f3fc",
                textDecoration: "none",
              }}
            >
              + Create / Register a Token
            </Link>

            <Link
              href="/launch"
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                border: "1px solid #1f2937",
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 500,
                color: "#e5e7eb",
                textDecoration: "none",
                background: "rgba(15,23,42,0.9)",
              }}
            >
              Launch Panel (coming soon)
            </Link>
          </div>
        </header>

        {/* STATUS BANNER FOR HUB TOKENS */}
        {status && (
          <div
            style={{
              borderRadius: 10,
              border: "1px solid #1f2937",
              background: "#020617",
              padding: 10,
              fontSize: 12,
              color: status.startsWith("Error") ? "#f97373" : "#9ca3af",
            }}
          >
            {status}
          </div>
        )}

        {/* HUB TOKENS SECTION */}
        <section
          style={{
            background: "#020617",
            padding: 20,
            borderRadius: 16,
            border: "1px solid #1f2937",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 4 }}>
                Cyber Dev Hub Tokens (Supabase)
              </h2>
              {!loadingTokens && tokens.length > 0 && (
                <span style={{ fontSize: 11, color: "#64748b" }}>
                  Showing {filteredAndSortedTokens.length} of{" "}
                  {tokens.length} profiles
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {/* Search */}
              <input
                type="text"
                placeholder="Search by name or symbol..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #1f2937",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: 12,
                  minWidth: 180,
                }}
              />

              {/* Filter: links */}
              <button
                type="button"
                onClick={() => setOnlyWithLinks((prev) => !prev)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: onlyWithLinks
                    ? "1px solid rgba(34,211,238,0.8)"
                    : "1px solid #1f2937",
                  background: onlyWithLinks
                    ? "rgba(8,47,73,0.9)"
                    : "rgba(15,23,42,0.9)",
                  color: onlyWithLinks ? "#a5f3fc" : "#e5e7eb",
                  fontSize: 11,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {onlyWithLinks ? "With Links ✓" : "Only Tokens With Links"}
              </button>

              {/* Filter: watchlist */}
              <button
                type="button"
                onClick={() => setOnlyWatchlist((prev) => !prev)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: onlyWatchlist
                    ? "1px solid rgba(251,191,36,0.9)"
                    : "1px solid #1f2937",
                  background: onlyWatchlist
                    ? "rgba(88,28,12,0.9)"
                    : "rgba(15,23,42,0.9)",
                  color: onlyWatchlist ? "#fde68a" : "#e5e7eb",
                  fontSize: 11,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {onlyWatchlist ? "Watchlist ✓" : "Only Watchlisted"}
              </button>

              {/* Sort mode */}
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: "1px solid #1f2937",
                  background: "#020617",
                  color: "#e5e7eb",
                  fontSize: 11,
                }}
              >
                <option value="recent">Sort: Newest</option>
                <option value="heat">Sort: Heat Score</option>
              </select>
            </div>
          </div>

          {/* Hub tokens grid */}
          {loadingTokens ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading...</p>
          ) : tokens.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              No tokens created yet. Use the builder to mint the first
              profile.
            </p>
          ) : filteredAndSortedTokens.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              No tokens match your filters. Clear search or toggle filters.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {filteredAndSortedTokens.map((t) => {
                const isWatched = watchlist.includes(t.id);
                const live = t.mergedLive;
                return (
                  <Link
                    key={t.id}
                    href={`/tokens/${t.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        borderRadius: 12,
                        border: "1px solid #1f2937",
                        padding: 12,
                        background:
                          "radial-gradient(circle at top left, #020617, #020617)",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {/* top row: avatar + name + star */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {t.image_url ? (
                            <img
                              src={t.image_url}
                              alt={t.name || ""}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 999,
                                objectFit: "cover",
                                border: "1px solid #374151",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 999,
                                border: "1px solid #374151",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                color: "#6b7280",
                              }}
                            >
                              ?
                            </div>
                          )}
                          <div>
                            <div
                              style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#e5e7eb",
                              }}
                            >
                              {t.name || "Unnamed Token"}
                            </div>
                            <div
                              style={{ fontSize: 12, color: "#9ca3af" }}
                            >
                              {t.symbol || "SYM"}
                            </div>
                          </div>
                        </div>

                        {/* watchlist star */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWatch(t.id);
                          }}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: 18,
                            lineHeight: 1,
                            color: isWatched ? "#facc15" : "#4b5563",
                          }}
                          aria-label="Toggle watchlist"
                        >
                          {isWatched ? "★" : "☆"}
                        </button>
                      </div>

                      {/* description */}
                      <p
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                          minHeight: 32,
                        }}
                      >
                        {t.description || "No description provided yet."}
                      </p>

                      {/* heat + live mini-bar */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          fontSize: 11,
                          color: "#9ca3af",
                        }}
                      >
                        <span>Heat: {t.heatScore}</span>
                        {live && (
                          <>
                            <span>· Price: {live.priceUsd ? `$${Number(live.priceUsd).toFixed(6)}` : "—"}</span>
                            <span>
                              · 24h Vol:{" "}
                              {live.volume24h
                                ? `$${live.volume24h.toLocaleString()}`
                                : "—"}
                            </span>
                            <span>
                              · Liq:{" "}
                              {live.liquidityUsd
                                ? `$${live.liquidityUsd.toLocaleString()}`
                                : "—"}
                            </span>
                          </>
                        )}
                      </div>

                      {/* links row */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          fontSize: 11,
                          marginTop: 4,
                        }}
                      >
                        {t.telegram_url && (
                          <a
                            href={t.telegram_url}
                            target="_blank"
                            rel="noreferrer"
                            style={linkPillStyle}
                            onClick={(e) => e.stopPropagation()}
                          >
                            TG
                          </a>
                        )}
                        {t.x_url && (
                          <a
                            href={t.x_url}
                            target="_blank"
                            rel="noreferrer"
                            style={linkPillStyle}
                            onClick={(e) => e.stopPropagation()}
                          >
                            X
                          </a>
                        )}
                        {t.website_url && (
                          <a
                            href={t.website_url}
                            target="_blank"
                            rel="noreferrer"
                            style={linkPillStyle}
                            onClick={(e) => e.stopPropagation()}
                          >
                            Site
                          </a>
                        )}
                        {!t.telegram_url && !t.x_url && !t.website_url && (
                          <span
                            style={{
                              color: "#6b7280",
                              fontSize: 11,
                            }}
                          >
                            No links
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* LIVE SOLANA FEED SECTION */}
        <section
          style={{
            background: "#020617",
            padding: 20,
            borderRadius: 16,
            border: "1px solid #1f2937",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, marginBottom: 4 }}>
              Live Solana Pairs (Dexscreener Feed)
            </h2>
            <p style={{ fontSize: 12, color: "#64748b" }}>
              Read-only view of real market pairs pulled via the public
              Dexscreener API. Use this as your live radar next to the curated
              builder hub.
            </p>
          </div>

          {loadingLive ? (
            <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading...</p>
          ) : liveError ? (
            <p style={{ color: "#f97373", fontSize: 13 }}>{liveError}</p>
          ) : liveTokens.length === 0 ? (
            <p style={{ color: "#6b7280", fontSize: 13 }}>
              No live pairs returned. Dexscreener may be throttling or changing
              results.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 16,
              }}
            >
              {liveTokens.map((t) => (
                <a
                  key={t.id}
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      borderRadius: 12,
                      border: "1px solid #1f2937",
                      padding: 12,
                      background:
                        "radial-gradient(circle at top left, #020617, #020617)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      {t.imageUrl ? (
                        <img
                          src={t.imageUrl}
                          alt={t.name}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 999,
                            objectFit: "cover",
                            border: "1px solid #374151",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 999,
                            border: "1px solid #374151",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            color: "#6b7280",
                          }}
                        >
                          ?
                        </div>
                      )}

                      <div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#e5e7eb",
                          }}
                        >
                          {t.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                          }}
                        >
                          {t.symbol} • {t.chainId}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        fontSize: 11,
                        color: "#9ca3af",
                      }}
                    >
                      <span>
                        Price:{" "}
                        {t.priceUsd
                          ? `$${Number(t.priceUsd).toFixed(6)}`
                          : "—"}
                      </span>
                      <span>
                        · 24h Vol:{" "}
                        {t.volume24h
                          ? `$${t.volume24h.toLocaleString()}`
                          : "—"}
                      </span>
                      <span>
                        · Liquidity:{" "}
                        {t.liquidityUsd
                          ? `$${t.liquidityUsd.toLocaleString()}`
                          : "—"}
                      </span>
                    </div>

                    {t.website && (
                      <div style={{ marginTop: 4, fontSize: 11 }}>
                        <span style={{ color: "#64748b" }}>Site: </span>
                        <span style={{ color: "#a5f3fc" }}>{t.website}</span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

const linkPillStyle: CSSProperties = {
  padding: "4px 8px",
  borderRadius: 999,
  border: "1px solid #374151",
  color: "#e5e7eb",
  textDecoration: "none",
};
