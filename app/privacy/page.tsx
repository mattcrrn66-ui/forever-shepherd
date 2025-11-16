// app/privacy/page.tsx

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
        {/* Header */}
        <header className="mb-10 border-b border-slate-800 pb-6">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            Cyber Dev Token • $CDT
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-50">
            Privacy Notice
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            A simple overview of how this site currently handles data and usage
            information.
          </p>
        </header>

        <article className="space-y-6 text-sm leading-relaxed text-slate-200">
          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              1. Basic Usage Data
            </h2>
            <p>
              Like most websites, this site may collect basic technical information
              such as IP address, browser type, device information, and pages visited.
              This is typically used for analytics, security, and improving the
              platform experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              2. Forms and Token Profiles
            </h2>
            <p>
              When you create a token profile or submit information through a form,
              the data you enter (such as token name, symbol, links, and description)
              may be stored in the platform database and displayed publicly on the
              site. Only submit information you are comfortable making public.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              3. Wallets and On-Chain Activity
            </h2>
            <p>
              If future versions of Cyber Dev integrate directly with Solana wallets
              or on-chain contracts, on-chain activity may be read or displayed based
              on public blockchain data. The platform does not control the blockchain
              itself and does not store your private keys.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              4. Third-Party Services
            </h2>
            <p>
              The site may rely on third-party infrastructure such as hosting,
              analytics, or storage providers (for example, Vercel or Supabase).
              These providers may process data as part of delivering their services.
              Their privacy policies apply in addition to this notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              5. Cookies and Tracking
            </h2>
            <p>
              If cookies or similar technologies are used, they are primarily for
              essential site functionality, preferences, or anonymous analytics. You
              can usually control cookie behavior through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-cyan-300 mb-2">
              6. Updates to This Notice
            </h2>
            <p>
              As the Cyber Dev platform grows, this privacy notice may change to
              reflect new features, data flows, or legal requirements. The latest
              version will always be available on this page.
            </p>
          </section>

          <section className="border-t border-slate-800 pt-4 text-xs text-slate-500">
            <p>
              This simplified privacy notice is not legal advice. If you expand the
              platform to handle sensitive user data, payments, or large-scale
              analytics, consider obtaining a professionally drafted privacy policy.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
