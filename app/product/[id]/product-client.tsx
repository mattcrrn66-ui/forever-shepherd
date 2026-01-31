"use client";

import { useMemo, useState } from "react";

type Variant = {
  id: number;
  title: string;
  is_enabled: boolean;
  is_available: boolean;
};

type Image = { src: string; is_default?: boolean };

export default function ProductClient({ product }: { product: any }) {
  const variants: Variant[] = product?.variants ?? [];
  const images: Image[] = product?.images ?? [];

  const enabledVariants = useMemo(
    () => variants.filter((v) => v.is_enabled && v.is_available),
    [variants]
  );

  const defaultVariant = enabledVariants[0];
  const [variantId, setVariantId] = useState<number>(defaultVariant?.id ?? 0);
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const img =
    images.find((i) => i.is_default)?.src || images?.[0]?.src || "";

  async function checkout() {
    if (!variantId) return alert("Pick a size/color first.");

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              product_id: product.id,
              variant_id: String(variantId),
              qty,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e: any) {
      alert(e.message || "Checkout error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 md:p-10 text-white space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square rounded-2xl overflow-hidden bg-white/[0.04] ring-1 ring-white/10">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-white/50">
              No image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{product.title}</h1>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Variant</label>
            <select
              className="w-full rounded-xl bg-black/30 ring-1 ring-white/10 p-3"
              value={variantId}
              onChange={(e) => setVariantId(Number(e.target.value))}
            >
              {enabledVariants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-white/70">Quantity</label>
            <input
              type="number"
              min={1}
              max={20}
              className="w-full rounded-xl bg-black/30 ring-1 ring-white/10 p-3"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          <button
            onClick={checkout}
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold p-3 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Redirecting…" : "Checkout"}
          </button>

          <p className="text-xs text-white/50">
            Payment is processed by Stripe. Order is fulfilled by Printify.
          </p>
        </div>
      </div>
    </main>
  );
}
