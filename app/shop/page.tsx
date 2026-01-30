// app/shop/page.tsx
import { products } from "@/lib/products"

export default function ShopPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
        <p className="mt-2 text-foreground/70">
          Limited drops. No restocks.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium">{p.name}</h3>
              <p className="text-sm text-foreground/60">
                {p.description}
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-semibold">
                  ${p.price}
                </span>

                <button
                  disabled={p.status !== "in_stock"}
                  className="btn btn-outline disabled:opacity-40"
                >
                  {p.status === "sold_out"
                    ? "Sold Out"
                    : p.status === "preorder"
                    ? "Pre-Order"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
