import { v4 as uuidv4 } from "uuid";
import { Env } from "./env";

/**
 * Returns a stable UUID that identifies this browser session's cart.
 * Generated once and persisted in localStorage as "atm_cart_key".
 * This value is sent as `x-cart-key` on every API request so the server
 * can associate cart / wishlist data with an anonymous user without auth.
 */

export function getCartKey(): string {
  if (typeof window === "undefined") {
    // SSR guard — return a placeholder; the real key is only needed client-side.
    return "ssr-placeholder";
  }

  let key = localStorage.getItem(Env.CART_KEY_STORAGE);
  if (!key) {
    key = uuidv4();
    localStorage.setItem(Env.CART_KEY_STORAGE, key);
  }
  return key;
}

/** Clears the stored cart key (call on logout / cart reset). */
export function clearCartKey(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(Env.CART_KEY_STORAGE);
  }
}
