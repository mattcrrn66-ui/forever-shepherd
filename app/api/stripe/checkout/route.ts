import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
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
      return NextResponse.json({ ok: false, error: "Missing session_id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ ok: false, error: "Payment not completed" }, { status: 400 });
    }

    const cart = JSON.parse(session.metadata?.cart || "[]");
    const shipping = JSON.parse(session.metadata?.shipping || "{}");

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ ok: false, error: "Empty cart metadata" }, { status: 400 });
    }

    // Build Printify payload
    const payload = {
      external_id: `fs_${Date.now()}`,
      label: "Forever Shepherd Order",
      line_items: cart.map((i: any) => ({
        product_id: String(i.product_id),
        variant_id: String(i.variant_id),
        quantity: Number(i.quantity || 1),
      })),
      address_to: {
        first_name: String(shipping.first_name || ""),
        last_name: String(shippi_
