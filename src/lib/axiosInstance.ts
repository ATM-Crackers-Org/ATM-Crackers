import axios from "axios";
import { getCartKey } from "./cartKey";
import { Env } from "./env";

const api = axios.create({
  baseURL: Env.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: Env.API_TIMEOUT_MS,
});
api.interceptors.request.use(
  (config) => {
    const cartKey = getCartKey();
    config.headers["x-cart-key"] = cartKey;
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        `Request failed with status ${error.response.status}`;
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(
        new Error("No response from server. Please check your connection.")
      );
    }
    return Promise.reject(error);
  }
);

export default api;
