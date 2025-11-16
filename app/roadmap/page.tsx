// app/roadmap/page.tsx

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">

        {/* Header */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-50">
            Cyber Dev Token — Roadmap
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            Shipping tools for creators, devs & communities on Solana — in focused phases.
          </p>
        </header>

        <article className="space-y-10 text-slate-200 leading-relaxed">

          {/* Intro */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
              Overview
            </h2>
            <p className="mb-3">
              This roadmap is a living document. Cyber Dev Token is less than a day old,
              and the core focus is simple: ship fast, listen to builders, and evolve
              with real usage.
            </p>
            <p>
              Phases may overlap or adjust as the ecosystem grows, but the priorities
              remain the same — give creators, devs, and communities real tools, not noise.
            </p>
          </section>

          {/* Phase 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              Phase 1 — Foundation (Now)
            </h2>
            <p className="mb-3 text-slate-300">
              Get the core identity and first tool online.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Launch Cyber Dev brand, X account & website</li>
              <li>Ship Whitepaper v1.0</li>
              <li>Deploy Token Profiles Creator (MVP)</li>
              <li>Set up Supabase / Postgres and media storage</li>
              <li>Fix and stabilize image upload pipeline</li>
              <li>Begin public Dev Log updates for transparency</li>
            </ul>
          </section>

          {/* Phase 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              Phase 2 — Core Platform
            </h2>
            <p className="mb-3 text-slate-300">
              Turn a simple profile tool into a true dev + community hub.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Developer Hub dashboard (builder profiles, links, history)</li>
              <li>Public token directory with search and filtering</li>
              <li>Project linking system (sites, GitHub, dApps, docs)</li>
              <li>Community dashboard for updates and announcements</li>
              <li>UI / UX refinement for mobile and desktop</li>
            </ul>
          </section>

          {/* Phase 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              Phase 3 — CDT Utility Layer
            </h2>
            <p className="mb-3 text-slate-300">
              Bring the token online as a real utility asset, not just a ticker.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Deploy CDT token contract on Solana</li>
              <li>Integrate CDT for creator verification & boosted visibility</li>
              <li>Introduce dev reputation / badge system powered by CDT</li>
              <li>Gate advanced tools and analytics behind CDT access tiers</li>
              <li>Experiment with lightweight staking for profile credibility</li>
            </ul>
          </section>

          {/* Phase 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              Phase 4 — Expansion & Ecosystem
            </h2>
            <p className="mb-3 text-slate-300">
              Turn Cyber Dev into a base layer for builders across Solana.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Open-source selected modules for community contribution</li>
              <li>Deeper Solana integration (SPL tools, on-chain metadata, APIs)</li>
              <li>Analytics dashboard for tokens, devs, and communities</li>
              <li>Partnerships with Solana devs, creator platforms, and tools</li>
              <li>Embedded widgets and simple “plug into Cyber Dev” components</li>
            </ul>
          </section>

          {/* Phase 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
              Phase 5 — The Roundtable
            </h2>
            <p className="mb-3 text-slate-300">
              Hand more control to the people actually building and using the tools.
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Introduce Roundtable-style governance for key platform changes</li>
              <li>Community proposals for new tools and integrations</li>
              <li>Shared treasury structure for ecosystem growth</li>
              <li>CDT-based voting on roadmap priorities</li>
            </ul>
            <p>
              The Roundtable principle stays the same: no hype, no kings — just builders,
              all equal at the table.
            </p>
          </section>

          {/* Link back to whitepaper */}
          <section className="border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-400">
              For a deeper breakdown of the Cyber Dev ecosystem, read the{" "}
              <a
                href="/whitepaper"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                Cyber Dev Token Whitepaper v1.0
              </a>
              .
            </p>
          </section>

        </article>
      </div>
    </main>
  );
}
