import Link from "next/link";

export const dynamic = "force-dynamic";

type PrintifyImage = { src: string; is_default?: boolean };
type PrintifyProduct = {
  id: string;
  title: string;
  images?: PrintifyImage[];
};

function pickProducts(json: any): PrintifyProduct[] {
  // Your API returns: { ok, status, data: { current_page, data: [ المنتجات ] } }
  const arr = json?.data?.data;
  if (Array.isArray(arr)) return arr;

  // Fallbacks if you ever change the API shape
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;

  return [];
}

export default async function ShopPage() {
  try {
    const res = await fetch("/api/printify/products", { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return (
        <main className="p-6 md:p-10 space-y-4">
          <h1 className="text-3xl font-semibold text-white">Shop</h1>
          <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-white">
            <p className="font-medium">Printify API error</p>
            <p className="text-sm opacity-80 mt-1">
              Status: {res.status} {res.statusText}
            </p>
            {text ? (
              <pre className="mt-3 text-xs whitespace-pre-wrap break-words opacity-90">
                {text}
              </pre>
            ) : null}
          </div>
        </main>
      );
    }

    const json = await res.json();
    const products = pickProducts(json);

    return (
      <main className="p-6 md:p-10 space-y-6">
        <h1 className="text-3xl font-semibold text-white">Shop</h1>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 text-white/80">
            No products found. (API responded, but the list was empty.)
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const img =
                p.images?.find((i) => i.is_default)?.src ||
                p.images?.[0]?.src ||
                "";

              return (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 hover:bg-white/[0.06] transition"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-black/20 ring-1 ring-white/10">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={p.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
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
        )}
      </main>
    );
  } catch (err: any) {
    return (
      <main className="p-6 md:p-10 space-y-4">
        <h1 className="text-3xl font-semibold text-white">Shop</h1>
        <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-white">
          <p className="font-medium">Shop page crashed</p>
          <p className="text-sm opacity-80 mt-1">
            {err?.message ?? String(err)}
          </p>
        </div>
      </main>
    );
  }
}

// Forces TS to treat this file as a module even if something weird happens in CI
export {};
