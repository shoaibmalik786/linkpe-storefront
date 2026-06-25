// Server-only Linkpe Storefront API layer.
//
// This module instantiates the SDK with the store's API key + secret and exposes
// typed data helpers used by Server Components and Route Handlers. The secret
// must never reach the browser, so DO NOT import this from a Client Component —
// client interactions go through the app's own /api route handlers instead.

import { cache } from 'react';
import { LinkpeClient, LinkpeNotFoundError } from '@linkpe-storefront/sdk';
import type {
  Category,
  CustomerOrder,
  ProductDetail,
  ProductListParams,
  ProductListResult,
  ProductReviewsResponse,
  Store,
  StoreReviewsResponse,
} from '@linkpe-storefront/sdk';

let cachedClient: LinkpeClient | null = null;

/** Returns true when API credentials are present. Lets pages render a setup notice instead of crashing. */
export function isLinkpeConfigured(): boolean {
  return Boolean(process.env.LINKPE_KEY_ID && process.env.LINKPE_KEY_SECRET);
}

/** Lazily construct the SDK client from server-only env. Throws a clear error if unconfigured. */
export function linkpe(): LinkpeClient {
  if (cachedClient) return cachedClient;

  const keyId = process.env.LINKPE_KEY_ID;
  const keySecret = process.env.LINKPE_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      'Linkpe is not configured. Set LINKPE_KEY_ID and LINKPE_KEY_SECRET in .env.local (see .env.example).'
    );
  }

  cachedClient = new LinkpeClient({
    keyId,
    keySecret,
    baseUrl: process.env.LINKPE_API_BASE_URL || 'https://www.mylinkpe.in/api',
    appName: 'linkpe-storefront-template',
  });
  return cachedClient;
}

// ── Data helpers ───────────────────────────────────────────────────────────

// Read helpers are wrapped in React cache() so multiple components in the same
// render (e.g. the page body + SiteHeader) share one API call per unique input.
export const getStore = cache(async (): Promise<Store> => {
  return linkpe().store.get();
});

// The API returns a representative `image_url` per category; the installed SDK
// type may not declare it yet, so widen it here.
export type StoreCategory = Category & { image_url?: string | null };

export const getCategories = cache(async (): Promise<StoreCategory[]> => {
  return (await linkpe().categories.list()) as StoreCategory[];
});

export const listProducts = cache(async (params: ProductListParams = {}): Promise<ProductListResult> => {
  return linkpe().products.list(params);
});

/**
 * Resolve a product by its URL handle. The API's GET /v1/products/{idOrSlug}
 * accepts either a product UUID or a slug, so a single call covers both. Returns
 * null (not throw) when the product doesn't exist or isn't storefront-visible.
 */
export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  try {
    return await linkpe().products.get(handle);
  } catch (err) {
    if (err instanceof LinkpeNotFoundError) return null;
    throw err;
  }
}

export async function getProductReviews(productId: string, limit = 20): Promise<ProductReviewsResponse> {
  return linkpe().products.listReviews(productId, { limit });
}

export async function getStoreReviews(limit = 20): Promise<StoreReviewsResponse> {
  return linkpe().reviews.listStore({ limit });
}

export async function trackOrders(phoneNumber: string) {
  return linkpe().trackOrders.get(phoneNumber);
}

export async function trackOrder(slug: string, phone: string) {
  return linkpe().trackOrders.getOrder(slug, { phone });
}
