"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

type Variant = {
  id: number;
  title: string;
  price: number; // cents
  is_enabled: boolean;
  is_available: boolean;
};

type Image = { src: string; is_default?: boolean };

export default function ProductClient({ product }: { product: any }) {
  const variants: Variant[] = product?.variants ?? [];
  const images: Image[] = product?.images ?? [];

  const enabled = useMemo(
    () => variants.filter((v) => v.is_enabled && v.is_available),
    [variants]
  );

  const [variantId, setVariantId] = useState<number>(enabled[0]?.id ?? 0);
  const [qty, setQty] = useState<number>(1);
  const [msg, setMsg] = useState<string>("");

  const selected = enabled.find((v) => v.id === variantId);

  const img =
    images.find((i) => i.is_default)?.src || images?.[0]?.src || "";

  function onAdd() {
    if (!selected) return;

    addToCart({
      product_id: String(product.id),
      variant_id: String(selected.id),
      title: String(product.title),
      variant_title: String(selected.title),
      image: img,
      price_cents: Number(selected.price ?? 0),
      quantity: qty,
    });

    setMsg("Added to cart ✅");
    setTimeout(() => setMsg(""), 1500);
  }

  return (
    <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-white font-medium">Order</div>
        <Link href="/cart" className="text-sm text-white/70 underline">
          View cart
        </Link>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-white/70">Select variant</div>

        <div className="grid grid-cols-2 gap-2">
          {enabled.map((v) => {
            const active = v.id === variantId;
            return (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={`rounded-xl px-3 py-2 text-sm ring-1 transition ${
                  active
                    ? "bg-white text-black ring-white"
                    : "bg-black/30 text-white ring-white/10 hover:ring-white/30"
                }`}
              >
                <div className="font-medium">{v.title}</div>
                <div className={`${active ? "text-black/70" : "text-white/60"}`}>
                  ${(Number(v.price ?? 0) / 100).toFixed(2)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Quantity</label>
        <input
          type="number"
          min={1}
          max={20}
          className="w-full rounded-xl bg-black/30 ring-1 ring-white/10 px-3 py-2 text-white"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
        />
      </div>

      <button
        onClick={onAdd}
        disabled={!selected}
        className="w-full rounded-xl bg-white text-black font-semibold py-2 hover:opacity-90 transition disabled:opacity-60"
      >
        Add to Cart
      </button>

      {msg ? <div className="text-sm text-white/80">{msg}</div> : null}
    </div>
  );
}
