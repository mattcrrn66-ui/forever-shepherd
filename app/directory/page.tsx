// app/directory/page.tsx

type Token = {
  name: string;
  symbol: string;
  description: string;
  imageUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
};

const mockTokens: Token[] = [
  {
    name: "Cyber Dev Token",
    symbol: "CDT",
    description:
      "The Roundtable for Builders. Tools for creators, devs & communities on Solana.",
    websiteUrl: "https://cyberdevtoken.com",
    twitterUrl: "https://x.com/CyberDevTOKEN",
  },
  {
    name: "Example Builder Token",
    symbol: "BLDR",
    description:
      "Placeholder project to show how directory cards will look once hooked to the database.",
    websiteUrl: "https://yourproject.xyz",
  },
];

export default function DirectoryPage() {
  const tokens = mockTokens; // later: replace with real data from Supabase

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
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
            A simple directory of tokens and projects created through the Cyber Dev
            Hub. This will later be powered by live data from the platform.
          </p>
        </header>

        {/* Content */}
        <section className="space-y-6">
          {tokens.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No tokens have been added yet. Create your first profile on the home
              page to see it appear here.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {tokens.map((token, idx) => (
                <article
                  key={idx}
                  className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-50">
                        {token.name}
                      </h2>
                      <p className="text-xs text-cyan-300 font-mono">
                        {token.symbol}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3 line-clamp-3">
                    {token.description}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {token.websiteUrl && (
                      <a
                        href={token.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Site
                      </a>
                    )}
                    {token.twitterUrl && (
                      <a
                        href={token.twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        X
                      </a>
                    )}
                    {token.telegramUrl && (
                      <a
                        href={token.telegramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
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
            This page currently uses placeholder data. Soon it will be connected to
            the live Cyber Dev database so every token created on the Hub appears
            here automatically.
          </p>
        </section>
      </div>
    </main>
  );
}
