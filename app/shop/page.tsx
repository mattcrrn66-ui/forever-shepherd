import Link from "next/link";

export const dynamic = "force-dynamic";

type PrintifyImage = { src: string; is_default?: boolean };
type PrintifyProduct = {
  id: string;
  title: string;
  images?: PrintifyImage[];
};

export default async function ShopPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/printify/products`, {
    cache: "no-store",
  });

  const json = await res.json();
  const products: PrintifyProduct[] = json?.data?.data ?? [];

  return (
    <main className="p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-semibold text-white">Shop</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const img =
            p.images?.find((i) => i.is_default)?.src || p.images?.[0]?.src || "";

          return (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 hover:bg-white/[0.06] transition"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-black/20 ring-1 ring-white/10">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/50">
                    No image
                  </div>
                )}
              </div>

              <h2 className="mt-3 text-white font-medium">{p.title}</h2>
              <p className="mt-1 text-sm text-white/60">Tap to view</p>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
