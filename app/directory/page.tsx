// app/directory/page.tsx
import { createClient } from "@supabase/supabase-js";

type TokenRow = {
  id: string;
  name: string;
  symbol: string;
  description: string | null;
  image_url?: string | null;
  telegram_url?: string | null;
  x_url?: string | null;
  website_url?: string | null;
  created_at?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function DirectoryPage() {
  const { data, error } = await supabase
    // ✅ table name is lowercase "tokens"
    .from("tokens")
    .select("*")
    .order("created_at", { ascending: false });

  const tokens = (data as TokenRow[] | null) ?? [];

  return (
    <main className="min-h-screen cyber-page text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-50">
            Token Directory
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            Live list of tokens created through the Cyber Dev Hub. Data is
            loaded directly from the{" "}
            <span className="font-mono">tokens</span> table in Supabase.
          </p>
        </header>

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            <p className="font-semibold">Error loading tokens</p>
            <p className="text-xs mt-1 opacity-80">{error.message}</p>
          </div>
        )}

        {/* Content */}
        <section className="space-y-6">
          {tokens.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No tokens found yet. Create your first token profile on the home
              page and it will appear here automatically.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {tokens.map((token) => (
                <article
                  key={token.id}
                  className="border border-slate-800 rounded-2xl p-4 bg-slate-900/70 cyber-card hover:bg-slate-900/90 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-50">
                        {token.name || "Untitled Token"}
                      </h2>
                      <p className="text-xs text-cyan-300 font-mono">
                        {token.symbol || "—"}
                      </p>
                      {token.created_at && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          Created:{" "}
                          {new Date(token.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3 line-clamp-4">
                    {token.description || "No description provided yet."}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {token.website_url && (
                      <a
                        href={token.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 bg-slate-900/70 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.55)] transition-colors"
                      >
                        Site
                      </a>
                    )}
                    {token.x_url && (
                      <a
                        href={token.x_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 bg-slate-900/70 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.55)] transition-colors"
                      >
                        X
                      </a>
                    )}
                    {token.telegram_url && (
                      <a
                        href={token.telegram_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 bg-slate-900/70 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(34,211,238,0.55)] transition-colors"
                      >
                        TG
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Note */}
        <section className="mt-10 border-t border-slate-800 pt-5">
          <p className="text-xs text-slate-500">
            This directory reads directly from Supabase. Any token created
            through the Cyber Dev Hub should appear here as long as it is saved
            in the <span className="font-mono">tokens</span> table.
          </p>
        </section>
      </div>
    </main>
  );
}
