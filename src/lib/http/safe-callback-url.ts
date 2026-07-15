export function safeCallbackUrl(
  url: string | undefined,
  fallback = "/",
): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) {
    return fallback;
  }

  return url;
}
