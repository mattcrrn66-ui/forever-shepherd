export type CartItem = {
  product_id: string;
  variant_id: string;
  title: string;
  variant_title: string;
  image?: string;
  price_cents: number;
  quantity: number;
};

const KEY = "fs_cart_v1";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const idx = cart.findIndex(
    (x) => x.product_id === item.product_id && x.variant_id === item.variant_id
  );

  if (idx >= 0) {
    cart[idx].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  setCart(cart);
}

export function removeFromCart(product_id: string, variant_id: string) {
  const cart = getCart().filter(
    (x) => !(x.product_id === product_id && x.variant_id === variant_id)
  );
  setCart(cart);
}

export function updateQty(product_id: string, variant_id: string, quantity: number) {
  const cart = getCart().map((x) =>
    x.product_id === product_id && x.variant_id === variant_id
      ? { ...x, quantity }
      : x
  );
  setCart(cart);
}

export function clearCart() {
  setCart([]);
}

export function cartTotalCents(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);
}
