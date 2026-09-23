export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.humtripwale.com";
export const SITE_NAME = "HumTripWale";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
