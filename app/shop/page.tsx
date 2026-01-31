  const res = await fetch("/api/printify/products", { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Printify fetch failed: ${res.status} ${text}`);
  }

  const json = await res.json();

  const products: PrintifyProduct[] = json?.data?.data ?? json?.data ?? json ?? [];
