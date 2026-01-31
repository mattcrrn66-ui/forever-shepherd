import ProductClient from "./product-client";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/printify/products`, {
    cache: "no-store",
  });
  const json = await res.json();
  const products = json?.data?.data ?? [];
  const product = products.find((p: any) => p.id === params.id);

  if (!product) {
    return (
      <main className="p-6 text-white">
        <h1 className="text-2xl font-semibold">Product not found</h1>
      </main>
    );
  }

  return <ProductClient product={product} />;
}
