import { mockProducts } from "./mockProducts"
import { supabase } from "./supabaseClient"

const USE_MOCK_PRODUCTS = true // ← flip to false later

export async function getProducts() {
  if (USE_MOCK_PRODUCTS) {
    return mockProducts
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Supabase products error:", error)
    return []
  }

  return data
}
