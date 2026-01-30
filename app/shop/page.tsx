import { mockProducts } from "@/lib/mockProducts";

export default function ShopPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Shop</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full rounded-xl object-cover"
            />

            <div className="mt-3">
              <h2 className="font-medium">{product.name}</h2>
              <p className="text-sm text-foreground/70">
                {product.description}
              </p>

              <div className="mt-2 font-semibold">
                ${product.price}
              </div>

              <button className="btn btn-primary mt-3 w-full">
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
