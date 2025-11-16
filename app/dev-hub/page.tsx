// app/dev-hub/page.tsx

type DevProfile = {
  name: string;
  handle: string;
  role: string;
  summary: string;
  skills: string[];
  twitterUrl?: string;
  websiteUrl?: string;
};

const mockDevs: DevProfile[] = [
  {
    name: "Cyber Dev Origin",
    handle: "@CyberDevTOKEN",
    role: "Founder / Full-Stack",
    summary:
      "Building the Cyber Dev Token platform: token profiles, dev tooling, and community systems on Solana.",
    skills: ["Next.js", "TypeScript", "Supabase", "Solana"],
    twitterUrl: "https://x.com/CyberDevTOKEN",
    websiteUrl: "https://cyberdevtoken.com",
  },
  {
    name: "Example Builder",
    handle: "@example_builder",
    role: "Smart Contract Dev",
    summary:
      "Placeholder profile for future contributors. This card shows how devs will appear once the hub is wired to live data.",
    skills: ["Rust", "SPL Tokens", "DeFi"],
  },
];

export default function DevHubPage() {
  const devs = mockDevs; // later: replace with live data

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-50">
            Developer Hub
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            A space for builders behind the tokens. This hub will evolve into a
            verified directory of developers, contributors, and collaborators across
            the Cyber Dev ecosystem.
          </p>
        </header>

        {/* Dev Profiles */}
        <section className="space-y-6">
          {devs.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No developer profiles created yet. Developer accounts will appear here
              once the hub is connected to the live platform.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {devs.map((dev, idx) => (
                <article
                  key={idx}
                  className="border border-slate-800 rounded-2xl p-4 bg-slate-900/40 hover:bg-slate-900/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-50">
                        {dev.name}
                      </h2>
                      <p className="text-xs text-cyan-300 font-mono">
                        {dev.handle}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{dev.role}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-3 line-clamp-4">
                    {dev.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3 text-[11px]">
                    {dev.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full border border-slate-700 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {dev.websiteUrl && (
                      <a
                        href={dev.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Site
                      </a>
                    )}
                    {dev.twitterUrl && (
                      <a
                        href={dev.twitterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 rounded-full border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        X
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
            In future updates, this hub will be connected to authenticated developer
            accounts, verification flows, and contribution tracking for Cyber Dev
            Token and projects built around it.
          </p>
        </section>
      </div>
    </main>
  );
}
