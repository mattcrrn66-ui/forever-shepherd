import Link from "next/link";
import ProductClient from "./product-client";

export const dynamic = "force-dynamic";

type PrintifyImage = { src: string; is_default?: boolean; position?: string };
type PrintifyOptionValue = { id: number; title: string; colors?: string[] };
type PrintifyOption = {
  name: string;
  type: string;
  values: PrintifyOptionValue[];
};

type PrintifyVariant = {
  id: number;
  title: string;
  price: number; // cents
  is_enabled?: boolean;
  is_available?: boolean;
};

type PrintifyProduct = {
  id: string;
  title: string;
  description?: string;
  images?: PrintifyImage[];
  options?: PrintifyOption[];
  variants?: PrintifyVariant[];
};

function money(cents?: number) {
  if (typeof cents !== "number") return "";
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID || "26310502";

  if (!token) {
    return (
      <main className="p-6 md:p-10 space-y-4">
        <h1 className="text-3xl font-semibold text-white">Product</h1>
        <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-white">
          Missing PRINTIFY_API_TOKEN in Vercel env vars.
        </div>
        <Link className="text-white/70 underline" href="/shop">
          Back to shop
        </Link>
      </main>
    );
  }

  try {
    const url = `https://api.printify.com/v1/shops/${shopId}/products/${id}.json`;

    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const product: PrintifyProduct | null = await res.json().catch(() => null);

    if (!res.ok || !product) {
      return (
        <main className="p-6 md:p-10 space-y-4">
          <h1 className="text-3xl font-semibold text-white">Product</h1>
          <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-white">
            <div className="font-medium">Failed to load product</div>
            <div className="mt-2 text-sm text-white/80">
              {res.status} {res.statusText}
            </div>
            <div className="mt-2 text-xs text-white/70 break-words">URL: {url}</div>
          </div>
          <Link className="text-white/70 underline" href="/shop">
            Back to shop
          </Link>
        </main>
      );
    }

    const hero =
      product.images?.find((i) => i.is_default)?.src ||
      product.images?.[0]?.src ||
      "";

    // IMPORTANT: only show enabled+available variants
    const enabledVariants =
      product.variants?.filter(
        (v) => v.is_enabled !== false && v.is_available !== false
      ) ?? [];

    const cheapest =
      enabledVariants.length > 0
        ? enabledVariants.reduce(
            (min, v) => (v.price < min.price ? v : min),
            enabledVariants[0]
          )
        : undefined;

    // Build a "product" object for the client component (variants include price)
    const productForClient = {
      id: product.id,
      title: product.title,
      images: product.images ?? [],
      variants: enabledVariants.map((v) => ({
        id: v.id,
        title: v.title,
        price: v.price,
        is_enabled: v.is_enabled !== false,
        is_available: v.is_available !== false,
      })),
    };

    return (
      <main className="p-6 md:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <Link className="text-white/70 underline" href="/shop">
            ← Back
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-black/20 ring-1 ring-white/10">
              {hero ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white/50">
                  No image
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden bg-black/20 ring-1 ring-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-white">{product.title}</h1>

            {cheapest ? (
              <div className="text-white/90">
                Starting at{" "}
                <span className="font-semibold">{money(cheapest.price)}</span>
              </div>
            ) : (
              <div className="text-white/70">Pricing unavailable</div>
            )}

            {product.options?.length ? (
              <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4">
                <div className="text-white font-medium mb-2">Options</div>
                <div className="space-y-2 text-white/70 text-sm">
                  {product.options.map((opt) => (
                    <div key={opt.name}>
                      <span className="text-white/90">{opt.name}:</span>{" "}
                      {opt.values.slice(0, 8).map((v) => v.title).join(", ")}
                      {opt.values.length > 8 ? "…" : ""}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* READ-ONLY list can stay if you want */}
            {enabledVariants.length ? (
              <div className="rounded-2xl bg-white/[0.04] ring-1 ring-white/10 p-4">
                <div className="text-white font-medium mb-2">Variants</div>
                <div className="space-y-2 text-white/70 text-sm max-h-64 overflow-auto pr-2">
                  {enabledVariants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between rounded-xl bg-black/10 ring-1 ring-white/10 px-3 py-2"
                    >
                      <span>{v.title}</span>
                      <span className="text-white/90">{money(v.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* THIS is the interactive Add-to-Cart box */}
            <ProductClient product={productForClient} />
          </div>
        </div>
      </main>
    );
  } catch (err: any) {
    return (
      <main className="p-6 md:p-10 space-y-4">
        <h1 className="text-3xl font-semibold text-white">Product</h1>
        <div className="rounded-2xl bg-red-500/10 ring-1 ring-red-500/30 p-4 text-white">
          Product page crashed: {err?.message ?? String(err)}
        </div>
        <Link className="text-white/70 underline" href="/shop">
          Back to shop
        </Link>
      </main>
    );
  }
}
