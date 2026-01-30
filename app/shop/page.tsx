import { getProducts } from "@/lib/products"

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p: any) => (
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
            {p.tag && (
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-white/10">
                {p.tag}
              </span>
            )}

            <h3 className="text-sm font-medium">{p.name}</h3>

            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">${p.price}</span>
              {p.compareAt && (
                <span className="text-sm line-through text-white/40">
                  ${p.compareAt}
                </span>
              )}
            </div>

            <button
              disabled={p.status === "sold_out"}
              className="btn btn-outline w-full mt-2 disabled:opacity-40"
            >
              {p.status === "sold_out"
                ? "Sold Out"
                : p.status === "preorder"
                ? "Pre-Order"
                : "Add to Cart"}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
