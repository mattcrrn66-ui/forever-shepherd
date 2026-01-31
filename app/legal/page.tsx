// app/legal/page.tsx
import Link from "next/link";

type CardProps = {
  title: string;
  desc: string;
  href: string;
  tag?: string;
};

function Card({ title, desc, href, tag }: CardProps) {
  return (
    <Link
      href={href}
      className="group relative rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-6 hover:bg-white/[0.06] transition overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-spotlight blur-3xl opacity-50" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {tag ? (
          <span className="text-xs rounded-full bg-white/5 ring-1 ring-white/10 px-2 py-1 text-white/70">
            {tag}
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>

      <div className="mt-4 text-sm text-cyan-400 group-hover:text-violet-400 transition">
        Open →
      </div>
    </Link>
  );
}

export default function Page() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/10 p-8 md:p-12">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-spotlight blur-3xl opacity-50" />
          <div className="absolute bottom-[-220px] right-[-180px] h-[520px] w-[520px] rounded-full bg-spotlight2 blur-3xl opacity-35" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 ring-1 ring-white/10 px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-glow" />
            Legal • Policies
          </div>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-white">
            Legal / Policies
          </h1>

          <p className="mt-3 text-base md:text-lg text-white/70 leading-relaxed">
            The basics that protect you and set clear expectations: terms, privacy, returns,
            and shipping details.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link href="/" className="btn btn-ghost">
              Back Home
            </Link>
            <Link href="/shipping" className="btn btn-outline">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="grid gap-4 md:grid-cols-2">
        <Card
          title="Shipping & Returns"
          desc="Returns, exchanges, delivery windows, and what happens if something arrives damaged."
          href="/shipping"
          tag="Policy"
        />
        <Card
          title="Back to Shop"
          desc="Return to the storefront."
          href="/shop"
          tag="Store"
        />
      </section>

      {/* Policy Content */}
      <section className="rounded-3xl bg-white/[0.04] ring-1 ring-white/10 p-6 md:p-8 text-white/80 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Terms of Service</h2>
          <p className="text-sm leading-relaxed text-white/70">
            By purchasing from Forever Shepherd, you agree to our policies regarding ordering,
            pricing, fulfillment, and communications. We reserve the right to refuse service
            in cases of suspected fraud or abuse.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Privacy Policy</h2>
          <p className="text-sm leading-relaxed text-white/70">
            We only collect the information needed to process your order (name, shipping address,
            email, and optional phone). Payment details are processed by Stripe and are not stored
            on our servers. We do not sell your personal information.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Refunds & Chargebacks</h2>
          <p className="text-sm leading-relaxed text-white/70">
            If there’s an issue with your order (wrong item, damage, or fulfillment error),
            contact us and we’ll make it right. Unresolved chargebacks may result in account
            restrictions.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
          <p className="text-sm leading-relaxed text-white/70">
            Questions? Reach out via the contact method listed on the site or the email provided
            on your order receipt.
          </p>
        </div>
      </section>
    </div>
  );
}
