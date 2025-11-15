// app/whitepaper/page.tsx

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-50">
            Cyber Dev Token — Whitepaper v1.0
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            The Roundtable for Builders • A Community-Driven Development Hub on Solana
          </p>
        </header>

        <article className="space-y-8 text-slate-200 leading-relaxed">
          {/* 1. Executive Summary */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              1. Executive Summary
            </h2>
            <p className="mb-3">
              Cyber Dev Token ($CDT) is a community-driven development ecosystem built on Solana.
              Its mission is simple: create a unified hub where developers, creators, and
              communities can build, connect, and launch real tech.
            </p>
            <p className="mb-3">
              Cyber Dev is not a memecoin and not a pure hype engine. It is a builder-focused
              platform designed to empower users to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-200">
              <li>create token profiles</li>
              <li>link socials and websites</li>
              <li>upload project images</li>
              <li>establish credibility</li>
              <li>form communities</li>
              <li>collaborate on real projects</li>
              <li>onboard new builders into Solana</li>
            </ul>
            <p className="mt-3">
              $CDT is the native token powering the Roundtable — a decentralized dev hub.
            </p>
          </section>

          {/* 2. Vision */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">2. Vision</h2>
            <p className="mb-3">
              The future of Web3 depends on builders, not influencers, not hype cycles and not
              paid echo chambers. Builders.
            </p>
            <p className="mb-3">
              Cyber Dev Token exists to return Web3 to its roots: innovation, collaboration,
              transparency and real development.
            </p>
            <p>
              The goal is to create a platform where:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>any builder can publish their project</li>
              <li>communities can discover new tech</li>
              <li>devs can collaborate in a reputation-based system</li>
              <li>token creators can organize their ecosystem</li>
              <li>users can verify projects quickly and easily</li>
              <li>everyone contributes as an equal at the Roundtable</li>
            </ul>
          </section>

          {/* 3. Philosophy — The Roundtable Standard */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              3. Philosophy — The Roundtable Standard
            </h2>
            <p className="mb-3">
              Cyber Dev Token introduces the Roundtable Standard:
            </p>
            <p className="font-semibold mb-3">
              No hype. No noise. No empty promises. Only building.
            </p>
            <p className="mb-3">
              Every member of the ecosystem — developer, creator and community contributor — has
              equal standing and the ability to participate.
            </p>
            <p className="mb-2">
              The Roundtable represents:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>equality among builders</li>
              <li>transparency over hype</li>
              <li>collaboration over empty competition</li>
              <li>technology over theatrics</li>
            </ul>
            <p className="mt-3">
              This philosophy influences everything from UI design to roadmap decisions and
              community culture.
            </p>
          </section>

          {/* 4. Platform Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              4. Platform Overview
            </h2>
            <p className="mb-3">
              The Cyber Dev Platform is a full-stack solution designed for token creators,
              developers and communities.
            </p>
            <h3 className="text-xl font-semibold text-cyan-200 mt-4 mb-2">
              Core Modules (Live / In Progress)
            </h3>

            <h4 className="text-lg font-semibold text-slate-100 mt-3">
              4.1 Token Profile Creator (Live)
            </h4>
            <p className="mb-2">
              Users can create profiles for their tokens with:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>name and symbol</li>
              <li>description</li>
              <li>website link</li>
              <li>X (Twitter) link</li>
              <li>Telegram link</li>
              <li>image upload</li>
              <li>basic metadata display</li>
            </ul>

            <h4 className="text-lg font-semibold text-slate-100 mt-3">
              4.2 Developer Hub (In Progress)
            </h4>
            <p className="mb-3">
              A section where verified devs can list past projects, credibility, specializations
              and contributions to Cyber Dev.
            </p>

            <h4 className="text-lg font-semibold text-slate-100 mt-3">
              4.3 Community Dashboard (In Progress)
            </h4>
            <p className="mb-3">
              A feed where new token profiles, updates and collaborations appear in one place.
            </p>

            <h4 className="text-lg font-semibold text-slate-100 mt-3">
              4.4 Project Linking System (Planned)
            </h4>
            <p className="mb-2">
              Tokens will be able to link directly to:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>apps and dapps</li>
              <li>websites and landing pages</li>
              <li>GitHub repositories</li>
              <li>whitepapers</li>
              <li>governance or DAO portals</li>
            </ul>

            <h4 className="text-lg font-semibold text-slate-100 mt-3">
              4.5 CDT Utility Layer (Planned)
            </h4>
            <p>
              A future system for optional staking, feature unlocks and dev reputation mechanisms
              powered by $CDT.
            </p>
          </section>

          {/* 5. Token Utility */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              5. Token Utility ($CDT)
            </h2>
            <p className="mb-3">
              $CDT is the native token of the Cyber Dev ecosystem. Its utilities will expand as
              the platform evolves.
            </p>
            <p className="mb-2">
              Planned utilities include:
            </p>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              5.1 Creator Verification
            </h3>
            <p className="mb-3">
              Projects can use $CDT to verify their profiles and boost visibility within the
              platform.
            </p>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              5.2 Developer Reputation
            </h3>
            <p className="mb-3">
              Developer accounts can use $CDT to unlock features such as advanced analytics,
              profile badges and enhanced project linking tools.
            </p>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              5.3 Community Tools
            </h3>
            <p className="mb-3">
              Communities can use $CDT to boost project visibility, unlock additional media
              uploads and participate in Roundtable governance.
            </p>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              5.4 Platform Fees
            </h3>
            <p>
              If optional premium modules are introduced, fees for those features will be
              denominated in $CDT.
            </p>
          </section>

          {/* 6. Architecture & Tech Stack */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              6. Architecture & Tech Stack
            </h2>
            <p className="mb-3">
              The Cyber Dev Platform is built with a modern and scalable stack designed for fast
              iteration and growth.
            </p>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              6.1 Frontend
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Next.js / React</li>
              <li>Responsive, mobile-first UI</li>
              <li>Dynamic rendering for fast performance</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              6.2 Backend
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Supabase (PostgreSQL storage)</li>
              <li>Real-time API layer</li>
              <li>Scalable auth and storage</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              6.3 Media Handling
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Supabase bucket storage</li>
              <li>Dynamic image upload and retrieval</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              6.4 Hosting
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Vercel deployment</li>
              <li>24/7 uptime with serverless scaling</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              6.5 Blockchain Integration (Phase 2)
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Solana Web3 tooling</li>
              <li>On-chain metadata linking</li>
              <li>SPL token integrations</li>
              <li>Future CDT utility contracts</li>
            </ul>
          </section>

          {/* 7. Tokenomics (Draft) */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              7. Tokenomics (Draft)
            </h2>
            <p className="mb-3">
              Tokenomics will be finalized after community feedback. The guiding principles are:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>no hidden allocations</li>
              <li>no secret team wallets</li>
              <li>no predatory token structures</li>
              <li>transparent vesting</li>
              <li>community-first distribution</li>
            </ul>
            <p className="mb-2">
              A proposed structure:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-semibold">Total Supply:</span> TBD with community input</li>
              <li><span className="font-semibold">Initial Liquidity:</span> 100% to bonding curve then Raydium</li>
              <li><span className="font-semibold">Team Allocation:</span> 0% (community-driven project)</li>
              <li><span className="font-semibold">Treasury:</span> community-owned for platform development</li>
              <li><span className="font-semibold">Marketing:</span> as needed, with transparent reporting</li>
              <li><span className="font-semibold">Utility Reserve:</span> for future staking and verification tools</li>
            </ul>
          </section>

          {/* 8. Roadmap */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">8. Roadmap</h2>
            <p className="mb-3">
              Cyber Dev Token follows a pragmatic, builder-first roadmap that can evolve with
              community input.
            </p>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              Phase 1 — Foundation (Now)
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>launch X (Twitter) presence</li>
              <li>launch website MVP</li>
              <li>enable token profile creation</li>
              <li>release Whitepaper v1.0</li>
              <li>start early community formation</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              Phase 2 — Platform Expansion
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>developer profiles</li>
              <li>verified creator module</li>
              <li>community dashboard</li>
              <li>UI and UX refinement</li>
              <li>on-chain linking for metadata</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              Phase 3 — Token Launch
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>fair launch on pump.fun</li>
              <li>automatic Raydium liquidity pool</li>
              <li>community onboarding and education</li>
              <li>feature expansion based on usage</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              Phase 4 — Ecosystem Tools
            </h3>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>project linking system</li>
              <li>analytics dashboard</li>
              <li>CDT-powered utility roll-out</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-200 mt-3">
              Phase 5 — Cyber Dev Roundtable
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>governance mechanisms</li>
              <li>community-led development paths</li>
              <li>DAO-style decision frameworks</li>
            </ul>
          </section>

          {/* 9. Security Principles */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              9. Security Principles
            </h2>
            <p className="mb-3">
              Cyber Dev adheres to a strict set of principles:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>no hidden permissions or backdoors</li>
              <li>no central control over user assets</li>
              <li>no rug-pull mechanics in token design</li>
              <li>transparent communication and updates</li>
              <li>community oversight of treasury and roadmap</li>
              <li>progressive use of open-source components where possible</li>
            </ul>
          </section>

          {/* 10. Conclusion */}
          <section>
            <h2 className="text-2xl font-semibold text-cyan-300 mb-3">
              10. Conclusion
            </h2>
            <p className="mb-3">
              Cyber Dev Token represents a shift in Solana culture back to builders, back to
              community and back to real development.
            </p>
            <p className="mb-3">
              The Roundtable is open. Everyone is equal at the table. Everyone contributes.
              Everyone builds.
            </p>
            <p className="mb-3">
              This is not about hype or noise. This is Cyber Dev Token — $CDT: a community-driven
              dev ecosystem, a platform for real creators and a home for innovators on Solana.
            </p>
            <p className="mb-3">
              Join early. Build with us. Help shape the future.
            </p>
            <p className="font-semibold">
              Explore the platform:{' '}
              <a
                href="https://cyberdev-phi.vercel.app/"
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                https://cyberdev-phi.vercel.app/
              </a>
            </p>
          </section>
        </article>
      </div>
    </main>
  )
}
