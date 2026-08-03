export interface DeepLinkParts {
  scheme: string;
  host: string;
  path: string;
  query: { key: string; value: string }[];
}

export function buildDeepLink(parts: DeepLinkParts): string {
  const scheme = parts.scheme.trim() || "myapp";
  const host = parts.host.trim();
  let path = parts.path.trim();
  if (path && !path.startsWith("/")) path = `/${path}`;

  const params = parts.query
    .filter((q) => q.key.trim())
    .map(
      (q) =>
        `${encodeURIComponent(q.key.trim())}=${encodeURIComponent(q.value)}`
    )
    .join("&");

  const authority = host ? `://${host}` : "://";
  const base = `${scheme}${authority}${path}`;
  return params ? `${base}?${params}` : base;
}

export interface IntentUriOptions {
  scheme: string;
  host: string;
  path: string;
  packageName: string;
  action: string;
  category: string;
  fallbackUrl: string;
  extras: { key: string; value: string; type: "string" | "int" | "bool" }[];
}

export function buildIntentUri(opts: IntentUriOptions): string {
  const scheme = opts.scheme.trim() || "https";
  const host = opts.host.trim() || "example.com";
  let path = opts.path.trim();
  if (path && !path.startsWith("/")) path = `/${path}`;

  const segments: string[] = [`scheme=${scheme}`];
  if (opts.packageName.trim()) segments.push(`package=${opts.packageName.trim()}`);
  if (opts.action.trim()) segments.push(`action=${opts.action.trim()}`);
  if (opts.category.trim()) segments.push(`category=${opts.category.trim()}`);
  if (opts.fallbackUrl.trim()) {
    segments.push(`S.browser_fallback_url=${encodeURIComponent(opts.fallbackUrl.trim())}`);
  }

  for (const extra of opts.extras.filter((e) => e.key.trim())) {
    const key = extra.key.trim();
    if (extra.type === "int") segments.push(`i.${key}=${extra.value || "0"}`);
    else if (extra.type === "bool")
      segments.push(`b.${key}=${extra.value === "true" || extra.value === "1"}`);
    else segments.push(`S.${key}=${encodeURIComponent(extra.value)}`);
  }

  segments.push("end");
  return `intent://${host}${path}#Intent;${segments.join(";")}`;
}
