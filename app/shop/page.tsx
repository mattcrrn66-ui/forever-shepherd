import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type PrintifyImage = { src: string; is_default?: boolean };
type PrintifyProduct = {
  id: string;
  title: string;
  images?: PrintifyImage[];
};

export default async function ShopPage() {
  // Build an absolute URL (required in some Vercel/Node SSR cases)
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const protocol = h.get("x-forwarded-proto") || "https";

  if (!host) {
    return (
      <main className="p-6 md:p-10 space-y-4">
        <h1 className="text-3xl font-semibold text-white">Shop</h1>
        <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-white">
          Missing host header — cannot build API URL.
        </div>
      </main>
    );
  }

  const apiUrl = `${protocol}://${host}/api/printify/products`;

  const res = await fetch(apiUrl, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return (
      <main className="p-6 md:p-10 space-y-4">
        <h1 className="text-3xl font-semibold text-white">Shop</h1>
        <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-white">
          <div className="font-medium">Printify products API failed</div>
          <div className="mt-2 text-sm text-white/80">
            {res.status} {res.statusText}
          </div>
          <div className="mt-2 text-xs text-white/70 break-words">
            URL: {apiUrl}
          </div>
          {text ? (
            <pre className="mt-3 text-xs whitespace-pre-wrap break-words text-white/80">
              {text}
            </pre>
          ) : null}
        </div>
      </main>
    );
  }

  const json = await res.json();
  const products: PrintifyProduct[] = Array.isArray(json?.data?.data)
    ? json.data.data
    : [];

  return (
    <main className="p-6 md:p-10 space-y-6">
      <h1 className="text-3xl font-semibold text-white">Shop</h1>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4 text-white/70">
          No products returned from Printify.
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
}
