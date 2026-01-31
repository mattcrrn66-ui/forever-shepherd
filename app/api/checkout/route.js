// /app/api/checkout/route.js
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

// SERVER-SIDE PRICING (cents)
function getUnitAmountCents({ product_id, variant_id }) {
  return 2499; // example price
}

export async function POST(req) {
  try {
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return Response.json({ error: "No items provided" }, { status: 400 });
    }

    // Validate + normalize
    for (const it of items) {
      it.qty = Number(it.qty);

      if (!it?.product_id || !it?.variant_id || !it?.qty) {
        return Response.json({ error: "Invalid item format" }, { status: 400 });
      }

      if (!Number.isInteger(it.qty) || it.qty < 1 || it.qty > 20) {
        return Response.json({ error: "Quantity out of range" }, { status: 400 });
      }
    }

    // Stripe checkout line items
    const line_items = items.map((it) => ({
      quantity: it.qty,
      price_data: {
        currency: "usd",
        unit_amount: getUnitAmountCents(it),
        product_data: {
          name: "Apparel",
          metadata: {
            product_id: String(it.product_id),
            variant_id: String(it.variant_id),
          },
        },
      },
    }));

    // Cart saved to metadata for webhook → Printify
    const cart = items.map((it) => ({
      product_id: String(it.product_id),
      variant_id: String(it.variant_id),
      quantity: it.qty,
    }));

    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      phone_number_collection: { enabled: true },

      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,

      metadata: {
        cart: JSON.stringify(cart),
        created_from: "checkout_api",
      },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
