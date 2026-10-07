export const Env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",

  API_TIMEOUT_MS: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15_000),

  CART_KEY_STORAGE: process.env.NEXT_PUBLIC_CART_KEY_STORAGE ?? "atm_cart_key",
} as const;

export type EnvConfig = typeof Env;
