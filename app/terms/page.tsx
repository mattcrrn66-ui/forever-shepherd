// app/terms/page.tsx

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-50">
            Terms of Use
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            Basic terms for using the Cyber Dev site, tools, and experimental features.
          </p>
        </header>

        <article className="space-y-6 text-sm leading-relaxed text-slate-200">
          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              1. Not Financial or Investment Advice
            </h2>
            <p>
              Cyber Dev Token, this website, and any tools provided are for experimental
              and informational purposes only. Nothing on this site is financial,
              investment, tax, or legal advice. You are fully responsible for your own
              decisions and for complying with the laws in your region.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              2. Experimental Platform
            </h2>
            <p>
              The Cyber Dev platform is early-stage and evolving. Features may change,
              break, or be removed without notice. By using the site, you accept that
              downtime, bugs, and incomplete features are possible and that the platform
              is provided &quot;as is&quot; with no guarantees.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              3. User Responsibility
            </h2>
            <p>
              You are responsible for how you use any information or tools on this site,
              including how you interact with tokens, links, external sites, or
              third-party platforms. Always verify contracts, teams, and risks yourself
              before engaging with any project.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              4. No Endorsement of Projects
            </h2>
            <p>
              Token profiles, developer entries, and community content shown through
              the Cyber Dev platform do not represent endorsements or guarantees. The
              presence of a project or profile on this site does not mean it is safe,
              audited, or trustworthy. Do your own research.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              5. Third-Party Links
            </h2>
            <p>
              The platform may display links to external sites, wallets, communities,
              or tools. These are controlled by third parties, not by Cyber Dev. We are
              not responsible for their content, security, or actions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              6. Changes to These Terms
            </h2>
            <p>
              These Terms of Use may be updated over time as the platform grows. When
              they change, the updated version will be reflected on this page. By
              continuing to use the site, you accept the current version of the terms.
            </p>
          </section>

          <section className="border-t border-slate-800 pt-4 text-xs text-slate-500">
            <p>
              This simplified document is provided for general clarity only and does
              not replace professional legal review. If you are launching serious
              products or raising funds, consult a lawyer in your jurisdiction.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
