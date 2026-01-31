import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token || !shopId) {
    return NextResponse.json(
      { ok: false, error: "Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/products.json`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          error: data?.error || "Printify products request failed",
          data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, status: 200, data });
  } catch (err) {
    console.error("Printify products error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error calling Printify" },
      { status: 500 }
    );
  }
}
