
function get(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const Env = {
  API_BASE_URL: get(
    "NEXT_PUBLIC_API_BASE_URL",
    "https://atm-crackers-backend-ne5o.onrender.com"
  ),

  API_TIMEOUT_MS: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15_000),

  CART_KEY_STORAGE: process.env.NEXT_PUBLIC_CART_KEY_STORAGE ?? "atm_cart_key",
} as const;

export type EnvConfig = typeof Env;
