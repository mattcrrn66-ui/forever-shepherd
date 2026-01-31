import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: false, error: "Payment not completed" }, { status: 400 });
    }

    const cart = JSON.parse(session.metadata?.cart || "[]");
    const shipping = JSON.parse(session.metadata?.shipping || "{}");

    // Create Printify order (same shape your /api/printify/order expects)
    const payload = {
      label: "Forever Shepherd Order",
      send_to_production: true,
      address_to: {
        first_name: shipping.first_name,
        last_name: shipping.last_name,
        address1: shipping.address1,
        city: shipping.city,
        region: shipping.region,
        country: shipping.country,
        zip: shipping.zip,
        ...(shipping.phone ? { phone: shipping.phone } : {}),
      },
      line_items: cart.map((i: any) => ({
        product_id: i.product_id,
        variant_id: i.variant_id,
        quantity: i.quantity,
      })),
    };

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/printify/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok || !json?.ok) {
      return NextResponse.json({ ok: false, error: json?.error || "Printify order failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Confirm error" }, { status: 500 });
  }
}
