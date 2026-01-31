import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const cartJson = session.metadata?.cart || "[]";
    const cart = JSON.parse(cartJson);

    // You must collect shipping address BEFORE this, or use Stripe shipping address collection.
    // For now: create Printify order requires address_to. If you want, we can collect it in Stripe.
    // QUICK version: if you already collected address on your checkout page, store it in metadata too.

    // TODO: you’ll add address_to in metadata as well.
  }

  return NextResponse.json({ received: true });
}
