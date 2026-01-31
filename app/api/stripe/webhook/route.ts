import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

// ✅ FIX: remove apiVersion to avoid TypeScript mismatch
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    }

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook signature error: ${err.message}` }, { status: 400 });
    }

    // ✅ Only act on successful payments
    if (event.type === "checkout.session.completed") {
      // You can add logic here later (create Printify order via metadata)
      // For now we just acknowledge
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Webhook error" }, { status: 500 });
  }
}
