import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  const supabase = createClient();

  try {
    const { affiliate_code, source } = await req.json();
    const user_agent = req.headers.get("user-agent") || "unknown";
    const ip_address =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    const { data, error } = await supabase
      .from("affiliate_clicks")
      .insert({
        affiliate_code,
        source,
        user_agent,
        ip_address,
      })
      .select("*");

    if (error) {
      console.log("SUPABASE ERROR →", error);
      return NextResponse.json(
        { debug: "supabase insert error", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.log("UNCAUGHT ERROR →", e);
    return NextResponse.json(
      { debug: "uncaught", error: e.message },
      { status: 500 }
    );
  }
}
