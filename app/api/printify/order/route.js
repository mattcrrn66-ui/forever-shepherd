import { NextResponse } from "next/server";

function requireFields(obj, fields) {
  const missing = [];
  for (const f of fields) {
    if (obj?.[f] === undefined || obj?.[f] === null || obj?.[f] === "") {
      missing.push(f);
    }
  }
  return missing;
}

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(req) {
  const token = process.env.PRINTIFY_API_TOKEN;
  const shopId = process.env.PRINTIFY_SHOP_ID;

  if (!token || !shopId) {
    return NextResponse.json(
      { ok: false, error: "Missing PRINTIFY_API_TOKEN or PRINTIFY_SHOP_ID" },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { line_items, address_to, external_id, label, send_to_production } =
    body || {};

  // Validate line items
  if (!Array.isArray(line_items) || line_items.length === 0) {
    return NextResponse.json(
      { ok: false, error: "line_items must be a non-empty array" },
      { status: 400 }
    );
  }

  // ✅ Require region (state) now to prevent “On hold – address issues”
  const missingAddress = requireFields(address_to, [
    "first_name",
    "last_name",
    "address1",
    "city",
    "region",
    "country",
    "zip",
  ]);

  if (missingAddress.length) {
    return NextResponse.json(
      {
        ok: false,
        error: "address_to is missing required fields",
        missing: missingAddress,
      },
      { status: 400 }
    );
  }

  // Optional but strongly recommended for fewer holds
  // (Printify providers sometimes require it)
  if (address_to?.phone !== undefined && !isNonEmptyString(address_to.phone)) {
    return NextResponse.json(
      { ok: false, error: "address_to.phone must be a non-empty string if provided" },
      { status: 400 }
    );
  }

  // Validate each line item has required fields + good quantity
  for (const [i, item] of line_items.entries()) {
    const missing = requireFields(item, ["product_id", "variant_id", "quantity"]);
    if (missing.length) {
      return NextResponse.json(
        {
          ok: false,
          error: `line_items[${i}] missing fields`,
          missing,
        },
        { status: 400 }
      );
    }

    const q = Number(item.quantity);
    if (!Number.isFinite(q) || q < 1 || !Number.isInteger(q)) {
      return NextResponse.json(
        {
          ok: false,
          error: `line_items[${i}].quantity must be a positive integer`,
        },
        { status: 400 }
      );
    }
  }

  // ✅ Printify requires product_id + variant_id as strings
  const normalizedLineItems = line_items.map((item) => ({
    product_id: String(item.product_id),
    variant_id: String(item.variant_id),
    quantity: Number(item.quantity),
  }));

  // ✅ Normalize country + region just in case (keeps them as strings)
  const normalizedAddress = {
    ...address_to,
    first_name: String(address_to.first_name),
    last_name: String(address_to.last_name),
    address1: String(address_to.address1),
    city: String(address_to.city),
    region: String(address_to.region), // e.g. "FL"
    country: String(address_to.country), // e.g. "US"
    zip: String(address_to.zip),
    ...(address_to.phone ? { phone: String(address_to.phone) } : {}),
  };

  const payload = {
    external_id: external_id || `fs_${Date.now()}`,
    label: label || "Forever Shepherd Order",
    line_items: normalizedLineItems,
    address_to: normalizedAddress,

    // ✅ SAFE CONTROL:
    // Only sends to production if the request explicitly passes boolean true.
    // This prevents “true” (string) or accidental truthy values.
    send_to_production: send_to_production === true,
  };

  try {
    const res = await fetch(
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

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          status: res.status,
          error: data?.error || "Printify order request failed",
          data,
        },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, status: 200, data });
  } catch (err) {
    console.error("Printify order error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error calling Printify" },
      { status: 500 }
    );
  }
}
