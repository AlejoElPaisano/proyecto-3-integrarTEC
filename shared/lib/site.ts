export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://passfrases.vercel.app"

export const ROUTES = ["/", "/generator", "/batch", "/history", "/favorites", "/strength-checker"] as const
