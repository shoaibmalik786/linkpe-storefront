// Client-side cart, persisted to localStorage. The line shape matches what the
// SDK's cart/checkout endpoints expect (product_id, quantity, selected_variants,
// addons) plus a few display fields so the cart/checkout UI can render without
// re-fetching. Server-side pricing is always recomputed via cart.totals /
// checkout.initiate — these client prices are display-only.

import type { SelectedVariant, SelectedAddon } from '@linkpe-storefront/sdk';

export type CartLine = {
  product_id: string;
  quantity: number;
  selected_variants?: SelectedVariant[];
  addons?: SelectedAddon[];
  // Display-only snapshot
  name: string;
  slug: string | null;
  unit_price: number;
  image_url: string | null;
  variant_summary?: string | null;
};

const KEY = 'linkpe_cart';
const EVENT = 'linkpe:cart-changed';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function readCart(): CartLine[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(lines));
  window.dispatchEvent(new CustomEvent(EVENT));
}

// Two lines are the "same" line only when product + variant selection match, so
// re-adding the same configuration bumps quantity instead of duplicating.
export function sameLine(a: CartLine, b: CartLine): boolean {
  if (a.product_id !== b.product_id) return false;
  const av = JSON.stringify((a.selected_variants ?? []).map((v) => v.option_id).sort());
  const bv = JSON.stringify((b.selected_variants ?? []).map((v) => v.option_id).sort());
  if (av !== bv) return false;
  const aa = JSON.stringify((a.addons ?? []).map((x) => x.addon_id).sort());
  const ba = JSON.stringify((b.addons ?? []).map((x) => x.addon_id).sort());
  return aa === ba;
}

export function addToCart(line: CartLine): void {
  const cart = readCart();
  const existing = cart.find((l) => sameLine(l, line));
  if (existing) {
    existing.quantity += line.quantity;
  } else {
    cart.push(line);
  }
  writeCart(cart);
}

export function cartCount(): number {
  return readCart().reduce((n, l) => n + l.quantity, 0);
}

export function updateCartQuantity(
  productId: string,
  quantity: number
): void {
  const cart = readCart();

  const updated = cart.map((item) =>
    item.product_id === productId
      ? {
          ...item,
          quantity: Math.max(1, quantity),
        }
      : item
  );

  writeCart(updated);
}

export function removeCartItem(productId: string): void {
  const cart = readCart();

  const updated = cart.filter(
    (item) => item.product_id !== productId
  );

  writeCart(updated);
}

export function clearCart(): void {
  writeCart([]);
}

export const CART_CHANGED_EVENT = EVENT;
