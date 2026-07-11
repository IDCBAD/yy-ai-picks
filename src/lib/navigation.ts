export function buildSearchHref(query: string): string {
  const normalized = query.trim();
  if (!normalized) return "/search";

  const params = new URLSearchParams({ q: normalized });
  return `/search?${params.toString()}`;
}
