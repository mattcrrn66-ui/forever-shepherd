"use client";

import { useEffect, useState } from "react";
import { clearCart } from "@/lib/cart";

export default function SuccessPage() {
  const [msg, setMsg] = useState("Verifying payment...");

  useEffect(() => {
    async function run() {
      const params = new URLSearchParams(window.location.search);
      const session_id = params.get("session_id");
      if (!session_id) {
        setMsg("Missing session id.");
        return;
      }

      const res = await fetch("/api/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setMsg(`Payment confirmed but order failed: ${json?.error || res.statusText}`);
        return;
      }

      clearCart();
      setMsg("Payment complete ✅ Order submitted to Printify ✅");
    }

    run();
  }, []);

  return (
    <main className="p-6 md:p-10 text-white">
      <h1 className="text-3xl font-semibold">Success</h1>
      <p className="mt-3 text-white/80">{msg}</p>
    </main>
  );
}
