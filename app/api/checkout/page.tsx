"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartItem, clearCart, getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    address1: "",
    city: "",
    region: "", // state (e.g. FL)
    country: "US",
    zip: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    setItems(getCart());
  }, []);

  async function submit() {
    setMsg("");
    if (items.length === 0) {
      setMsg("Cart is empty.");
      return;
    }

    // Minimal client validation
    const required = ["first_name", "last_name", "address1", "city", "region", "country", "zip"] as const;
    for (const k of required) {
      if (!form[k].trim()) {
        setMsg(`Missing ${k.replace("_", " ")}`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        label: "Forever Shepherd Order",
        send_to_production: true, // set false if you want test mode
        address_to: {
          first_name: form.first_name,
          last_name: form.last_name,
          address1: form.address1,
          city: form.city,
          region: form.region,
          country: form.country,
          zip: form.zip,
          ...(form.phone ? { phone: form.phone } : {}),
          ...(form.email ? { email: form.email } : {}),
        },
        line_items: items.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch("/api/printify/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setMsg(`Order failed: ${json?.error || res.statusText}`);
        return;
      }

      clearCart();
      setItems([]);
      setMsg("Order created ✅ (check Printify orders)");
    } catch (e: any) {
      setMsg(e?.message ?? "Checkout crashed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Checkout</h1>
        <Link className="text-white/70 underline" href="/cart">
          Back to cart
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 text-white/70">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 space-y-3">
            <div className="text-white font-medium">Shipping</div>

            {[
              ["first_name", "First name"],
              ["last_name", "Last name"],
              ["address1", "Address"],
              ["city", "City"],
              ["region", "State (e.g. FL)"],
              ["zip", "ZIP"],
              ["phone", "Phone (optional)"],
              ["email", "Email (optional)"],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm text-white/70">
                {label}
                <input
                  className="mt-1 w-full rounded-xl bg-black/30 ring-1 ring-white/10 px-3 py-2 text-white"
                  value={(form as any)[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
              </label>
            ))}

            <label className="block text-sm text-white/70">
              Country
              <select
                className="mt-1 w-full rounded-xl bg-black/30 ring-1 ring-white/10 px-3 py-2 text-white"
                value={form.country}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
              >
                <option value="US">US</option>
              </select>
            </label>

            <button
              disabled={loading}
              onClick={submit}
              className="w-full rounded-xl bg-white text-black font-semibold py-2 hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>

            {msg ? <div className="text-sm text-white/80">{msg}</div> : null}
          </div>

          <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4">
            <div className="text-white font-medium mb-2">Order summary</div>
            <div className="space-y-2 text-sm text-white/70">
              {items.map((i) => (
                <div key={`${i.product_id}_${i.variant_id}`} className="flex justify-between">
                  <div>
                    {i.title} <span className="opacity-70">({i.variant_title})</span> × {i.quantity}
                  </div>
                  <div>${((i.price_cents * i.quantity) / 100).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
