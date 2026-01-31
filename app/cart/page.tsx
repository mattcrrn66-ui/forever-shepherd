"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartItem, cartTotalCents, getCart, removeFromCart, updateQty } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(() => cartTotalCents(items), [items]);

  function refresh() {
    setItems(getCart());
  }

  return (
    <main className="p-6 md:p-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white">Cart</h1>
        <Link className="text-white/70 underline" href="/shop">
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 text-white/70">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div
              key={`${it.product_id}_${it.variant_id}`}
              className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 flex gap-4"
            >
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-black/20 ring-1 ring-white/10">
                {it.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>

              <div className="flex-1">
                <div className="text-white font-medium">{it.title}</div>
                <div className="text-white/70 text-sm">{it.variant_title}</div>
                <div className="text-white/80 text-sm mt-1">
                  ${(it.price_cents / 100).toFixed(2)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <input
                  type="number"
                  min={1}
                  className="w-24 rounded-xl bg-black/30 ring-1 ring-white/10 px-3 py-2 text-white"
                  value={it.quantity}
                  onChange={(e) => {
                    updateQty(it.product_id, it.variant_id, Math.max(1, Number(e.target.value || 1)));
                    refresh();
                  }}
                />
                <button
                  className="text-sm text-red-300 underline"
                  onClick={() => {
                    removeFromCart(it.product_id, it.variant_id);
                    refresh();
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <div className="text-white/80">Total</div>
            <div className="text-white font-semibold">${(total / 100).toFixed(2)}</div>
          </div>

          <Link
            href="/checkout"
            className="block text-center rounded-xl bg-white text-black font-semibold py-2 hover:opacity-90 transition"
          >
            Checkout
          </Link>
        </div>
      )}
    </main>
  );
}
