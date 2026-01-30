export type Product = {
  id: string
  name: string
  price: number
  compareAt?: number
  description?: string
  image: string
  tag?: string
  status?: "in_stock" | "low" | "sold_out" | "preorder"
}

export const mockProducts: Product[] = [
  {
    id: "fs-001",
    name: "FOREVER SHEPHERD — BLACK TEE",
    price: 32,
    compareAt: 38,
    description: "Heavyweight cotton • structured fit",
    image: "https://images.unsplash.com/photo-1520975917784-3f20b1456ab8?auto=format&fit=crop&w=1400&q=80",
    tag: "First Release",
    status: "in_stock",
  },
  {
    id: "fs-002",
    name: "SHEPHERD MARK — WASHED CHARCOAL",
    price: 36,
    description: "Garment dyed • relaxed feel",
    image: "https://images.unsplash.com/photo-1520975869010-54d3c3f1c1c8?auto=format&fit=crop&w=1400&q=80",
    tag: "Limited",
    status: "low",
  },
  {
    id: "fs-003",
    name: "GUIDANCE THAT REMAINS — WHITE",
    price: 28,
    description: "Soft touch • everyday wear",
    image: "https://images.unsplash.com/photo-1520975693415-35b8c4a1aa6a?auto=format&fit=crop&w=1400&q=80",
    tag: "Core",
    status: "in_stock",
  },
  {
    id: "fs-004",
    name: "FOREVER SHEPHERD — HOODIE",
    price: 68,
    compareAt: 78,
    description: "Premium fleece • drop shoulder",
    image: "https://images.unsplash.com/photo-1520975919990-f0bb0d0b1d63?auto=format&fit=crop&w=1400&q=80",
    tag: "Drop 01",
    status: "preorder",
  },
  {
    id: "fs-005",
    name: "SHEPHERD SIGIL — LONGSLEEVE",
    price: 44,
    description: "Midweight • rib cuff",
    image: "https://images.unsplash.com/photo-1520975853263-68c3d3a5b6f8?auto=format&fit=crop&w=1400&q=80",
    tag: "New",
    status: "in_stock",
  },
]
