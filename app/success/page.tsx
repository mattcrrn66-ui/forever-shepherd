"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearCart } from "@/lib/cart";

export default function SuccessPage() {
  const [msg, setMsg] = useState("Finalizing your order…");

  useEffect(() => {
    async function run() {
      const params = new URLSearchParams(window.location.search);
      const session_id = params.get("session_id");

      if (!session_id) {
        setMsg("We couldn't verify this payment. Please contact support.");
        return;
      }

      try {
        const res = await fetch("/api/stripe/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          setMsg("Payment received, but we couldn't finalize your order automatically. Please contact support.");
          return;
        }

        clearCart();
        setMsg("Order confirmed ✅ Payment received. We’re preparing your order now.");
      } catch {
        setMsg("Payment received, but we couldn't finalize your order automatically. Please contact support.");
      }
    }

    run();
  }, []);

  return (
    <main className="p-6 md:p-10 text-white space-y-4">
      <h1 className="text-3xl font-semibold">Order confirmed</h1>
      <p className="text-white/80">{msg}</p>

      <div className="flex gap-3">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-xl bg-white text-black font-semibold px-4 py-2 hover:opacity-90 transition"
        >
          Keep shopping
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-black/30 ring-1 ring-white/10 px-4 py-2 text-white hover:ring-white/30 transition"
        >
          Back home
        </Link>
      </div>

      <p className="text-xs text-white/50">
        If you have any issues, contact support and include your payment confirmation email.
      </p>
    </main>
  );
}
