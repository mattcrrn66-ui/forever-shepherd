// lib/products.ts

export type Product = {
  id: string
  name: string
  price: number
  description: string
  image: string
  status: "in_stock" | "sold_out" | "preorder"
}

export const products: Product[] = [
  {
    id: "fs-black-tee",
    name: "Forever Shepherd — Black Tee",
    price: 38,
    description: "Heavyweight cotton. Structured fit.",
    image: "/products/black-tee.png",
    status: "in_stock",
  },
  {
    id: "fs-white-tee",
    name: "Forever Shepherd — White Tee",
    price: 34,
    description: "Soft-touch everyday essential.",
    image: "/products/white-tee.png",
    status: "in_stock",
  },
  {
    id: "fs-hoodie-black",
    name: "Forever Shepherd — Hoodie",
    price: 78,
    description: "Premium fleece. Drop shoulder.",
    image: "/products/hoodie-black.png",
    status: "preorder",
  },
]
