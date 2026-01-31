import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    const body = await req.json();
    const { items, shipping } = body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Missing cart items" }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://forever-shepherd-git-master-cyberdevtokens-projects.vercel.app";

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (i: any) => ({
        quantity: Number(i.quantity || 1),
        price_data: {
          currency: "usd",
          unit_amount: Number(i.price_cents || 0),
          product_data: {
            name: `${i.title} (${i.variant_title})`,
            images: i.image ? [i.image] : undefined,
          },
        },
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        cart: JSON.stringify(items),
        shipping: JSON.stringify(shipping || {}),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Stripe error" }, { status: 500 });
  }
}
