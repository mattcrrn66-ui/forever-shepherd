import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const token = process.env.PRINTIFY_API_TOKEN;
    const shopId = process.env.PRINTIFY_SHOP_ID;

    if (!token || !shopId) {
      return NextResponse.json(
        { ok: false, error: "Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID" },
        { status: 500 }
      );
    }

    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json(
        { ok: false, error: "Missing session_id" },
        { status: 400 }
      );
    }

    // ✅ Pull truth from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { ok: false, error: "Payment not completed" },
        { status: 400 }
      );
    }

    const cartRaw = session.metadata?.cart;
    const shippingRaw = session.metadata?.shipping;

    if (!cartRaw) {
      return NextResponse.json(
        { ok: false, error: "Missing cart items in Stripe metadata" },
        { status: 400 }
      );
    }

    const cart = JSON.parse(cartRaw);
    const shipping = shippingRaw ? JSON.parse(shippingRaw) : {};

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Cart metadata is empty" },
        { status: 400 }
      );
    }

    // ✅ Build Printify payload
    const payload = {
      external_id: `fs_${Date.now()}`,
      label: "Forever Shepherd Order",
      send_to_production: true,
      address_to: {
        first_name: String(shipping.first_name || ""),
        last_name: String(shipping.last_name || ""),
        address1: String(shipping.address1 || ""),
        city: String(shipping.city || ""),
        region: String(shipping.region || ""),
        country: String(shipping.country || "US"),
        zip: String(shipping.zip || ""),
        ...(shipping.phone ? { phone: String(shipping.phone) } : {}),
      },
      line_items: cart.map((i: any) => ({
        product_id: String(i.product_id),
        variant_id: String(i.variant_id),
        quantity: Number(i.quantity || 1),
      })),
    };

    // Guard required shipping fields
    const required = ["first_name", "last_name", "address1", "city", "region", "country", "zip"] as const;
    for (const k of required) {
      const v = (payload.address_to as any)[k];
      if (!v || String(v).trim() === "") {
        return NextResponse.json(
          { ok: false, error: `Missing shipping field: ${k}` },
          { status: 400 }
        );
      }
    }

    // ✅ Create Printify order AFTER payment
    const printifyRes = await fetch(
      `https://api.printify.com/v1/shops/${shopId}/orders.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const data = await printifyRes.json().catch(() => null);

    if (!printifyRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: data?.error || "Printify order failed",
          data,
        },
        { status: printifyRes.status }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Confirm error" },
      { status: 500 }
    );
  }
}
