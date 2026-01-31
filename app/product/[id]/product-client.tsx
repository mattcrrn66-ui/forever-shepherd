"use client";

import { useMemo, useState } from "react";
import { addToCart } from "@/lib/cart";

type Variant = {
  id: number;
  title: string;
  price: number; // cents
  is_enabled?: boolean;
  is_available?: boolean;
};

type Image = { src: string; is_default?: boolean };

export default function ProductClient({
  product,
}: {
  product: any;
}) {
  const variants: Variant[] = product?.variants ?? [];
  const images: Image[] = product?.images ?? [];

  const enabled = useMemo(
    () => variants.filter((v) => v.is_enabled !== false && v.is_available !== false),
    [variants]
  );

  const defaultVariant = enabled[0];
  const [variantId, setVariantId] = useState<string>(
    defaultVariant?.id ? String(defaultVariant.id) : ""
  );
  const [qty, setQty] = useState<number>(1);
  const [msg, setMsg] = useState<string>("");

  const selected = enabled.find((v) => String(v.id) === variantId);

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
      <div className="text-white font-medium">Order</div>

      <div className="space-y-2">
        <label className="text-sm text-white/70">Variant</label>
        <select
          className="w-full rounded-xl bg-black/30 ring-1 ring-white/10 p-3 text-white"
          value={variantId}
          onChange={(e) => setVariantId(e.target.value)}
        >
          {enabled.map((v) => (
            <option key={v.id} value={String(v.id)}>
              {v.title} — ${(Number(v.price ?? 0) / 100).toFixed(2)}
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
          className="w-full rounded-xl bg-black/30 ring-1 ring-white/10 p-3 text-white"
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
        />
      </div>

      <button
        onClick={onAdd}
        disabled={!selected}
        className="w-full rounded-xl bg-white text-black font-semibold p-3 hover:opacity-90 disabled:opacity-60"
      >
        Add to Cart
      </button>

      {msg ? <div className="text-sm text-white/80">{msg}</div> : null}
    </div>
  );
}
