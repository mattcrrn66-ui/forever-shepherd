import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// in-memory idempotency (resets on restart)
const processed = new Set();

function splitName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first_name: "", last_name: "" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err?.message);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    // Only act on successful Checkout completion
    if (event.type !== "checkout.session.completed") {
      return new Response("Ignored", { status: 200 });
    }

    const session = event.data.object;

    // Safety: ensure it’s paid
    if (session.payment_status !== "paid") {
      return new Response("Not paid", { status: 200 });
    }

    // Prevent duplicates
    if (processed.has(session.id)) {
      return new Response("Already processed", { status: 200 });
    }
    processed.add(session.id);

    // Pull cart from metadata
    const cartRaw = session?.metadata?.cart;
    if (!cartRaw) throw new Error("Missing cart metadata");

    let cart;
    try {
      cart = JSON.parse(cartRaw);
    } catch {
      throw new Error("Invalid cart metadata JSON");
    }

    // ✅ IMPORTANT: Your /api/printify/order expects line_items with:
    // [{ product_id, variant_id, quantity }]
    const line_items = cart.map((it) => ({
      product_id: String(it.product_id),
      variant_id: String(it.variant_id),
      quantity: Number(it.quantity),
    }));

    // Grab address + buyer details from Stripe
    const details = session.customer_details || {};
    const addr = details.address || {};
    const nameParts = splitName(details.name);

    const address_to = {
      first_name: nameParts.first_name,
      last_name: nameParts.last_name,
      email: details.email || "",
      phone: details.phone || "",
      address1: addr.line1 || "",
      address2: addr.line2 || "",
      city: addr.city || "",
      region: addr.state || "",
      zip: addr.postal_code || "",
      country: addr.country || "US",
    };

    // ✅ IMPORTANT FIX: Call Printify route on the SAME host/port that received the webhook
    const host = req.headers.get("host"); // e.g. localhost:3000
    const url = `http://${host}/api/printify/order`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line_items,                 // ✅ matches Printify route
        address_to,
        send_to_production: false,  // ✅ safe launch mode
        external_id: session.id,    // ✅ matches Printify route
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Printify order failed: ${resp.status} ${text}`);
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Webhook error", { status: 500 });
  }
}
