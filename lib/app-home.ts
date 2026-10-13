import { AUTH_TOKEN_KEY } from "@/lib/constants";

/** Marketing landing (cold traffic). Soft-redirects logged-in users unless ?marketing=1. */
export const MARKETING_HOME = "/";

/** Marketing page that logged-in users can always open. */
export const MARKETING_WELCOME = "/welcome";

/** In-app product home (stories / tours feed). */
export const APP_HOME = "/explore";

/** Prefer app home when a session token exists (client-only). */
export function homeHrefForSession(): string {
  if (typeof window === "undefined") return MARKETING_HOME;
  return localStorage.getItem(AUTH_TOKEN_KEY) ? APP_HOME : MARKETING_HOME;
}

export function hasAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
}
