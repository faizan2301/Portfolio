export interface HttpStatus {
  code: number;
  phrase: string;
  category: string;
  description: string;
}

export const HTTP_STATUSES: HttpStatus[] = [
  { code: 100, phrase: "Continue", category: "Informational", description: "Request received; client may continue." },
  { code: 101, phrase: "Switching Protocols", category: "Informational", description: "Server switching protocols as requested." },
  { code: 102, phrase: "Processing", category: "Informational", description: "Request accepted; processing not complete (WebDAV)." },
  { code: 103, phrase: "Early Hints", category: "Informational", description: "Hints for preloading resources while preparing response." },
  { code: 200, phrase: "OK", category: "Success", description: "Request succeeded." },
  { code: 201, phrase: "Created", category: "Success", description: "Resource created successfully." },
  { code: 202, phrase: "Accepted", category: "Success", description: "Request accepted for processing but not completed." },
  { code: 204, phrase: "No Content", category: "Success", description: "Success with empty response body." },
  { code: 206, phrase: "Partial Content", category: "Success", description: "Partial resource returned (range requests)." },
  { code: 301, phrase: "Moved Permanently", category: "Redirection", description: "Resource permanently moved to a new URI." },
  { code: 302, phrase: "Found", category: "Redirection", description: "Temporary redirect to another URI." },
  { code: 303, phrase: "See Other", category: "Redirection", description: "Response available at another URI via GET." },
  { code: 304, phrase: "Not Modified", category: "Redirection", description: "Cached version is still valid." },
  { code: 307, phrase: "Temporary Redirect", category: "Redirection", description: "Temporary redirect; method must not change." },
  { code: 308, phrase: "Permanent Redirect", category: "Redirection", description: "Permanent redirect; method must not change." },
  { code: 400, phrase: "Bad Request", category: "Client Error", description: "Malformed request syntax or invalid framing." },
  { code: 401, phrase: "Unauthorized", category: "Client Error", description: "Authentication required or failed." },
  { code: 403, phrase: "Forbidden", category: "Client Error", description: "Server understood but refuses to authorize." },
  { code: 404, phrase: "Not Found", category: "Client Error", description: "Target resource does not exist." },
  { code: 405, phrase: "Method Not Allowed", category: "Client Error", description: "HTTP method not supported for this resource." },
  { code: 408, phrase: "Request Timeout", category: "Client Error", description: "Server timed out waiting for the request." },
  { code: 409, phrase: "Conflict", category: "Client Error", description: "Request conflicts with current resource state." },
  { code: 410, phrase: "Gone", category: "Client Error", description: "Resource permanently removed." },
  { code: 413, phrase: "Payload Too Large", category: "Client Error", description: "Request body larger than server allows." },
  { code: 415, phrase: "Unsupported Media Type", category: "Client Error", description: "Payload format not supported." },
  { code: 422, phrase: "Unprocessable Entity", category: "Client Error", description: "Well-formed but semantic errors (validation)." },
  { code: 429, phrase: "Too Many Requests", category: "Client Error", description: "Rate limit exceeded." },
  { code: 500, phrase: "Internal Server Error", category: "Server Error", description: "Unexpected server condition." },
  { code: 501, phrase: "Not Implemented", category: "Server Error", description: "Server does not support the requested functionality." },
  { code: 502, phrase: "Bad Gateway", category: "Server Error", description: "Invalid response from upstream server." },
  { code: 503, phrase: "Service Unavailable", category: "Server Error", description: "Server temporarily overloaded or down." },
  { code: 504, phrase: "Gateway Timeout", category: "Server Error", description: "Upstream server failed to respond in time." },
];

export function lookupHttpStatus(query: string): HttpStatus[] {
  const q = query.trim().toLowerCase();
  if (!q) return HTTP_STATUSES;
  return HTTP_STATUSES.filter(
    (s) =>
      String(s.code).includes(q) ||
      s.phrase.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );
}

export interface MimeEntry {
  mime: string;
  extensions: string[];
  description: string;
}

export const MIME_TYPES: MimeEntry[] = [
  { mime: "application/json", extensions: [".json"], description: "JSON data" },
  { mime: "application/xml", extensions: [".xml"], description: "XML document" },
  { mime: "application/pdf", extensions: [".pdf"], description: "PDF document" },
  { mime: "application/zip", extensions: [".zip"], description: "ZIP archive" },
  { mime: "application/gzip", extensions: [".gz"], description: "Gzip compressed" },
  { mime: "application/javascript", extensions: [".js", ".mjs"], description: "JavaScript" },
  { mime: "application/typescript", extensions: [".ts"], description: "TypeScript" },
  { mime: "application/octet-stream", extensions: [".bin", ".exe", ".dll"], description: "Arbitrary binary" },
  { mime: "application/x-www-form-urlencoded", extensions: [], description: "Form URL-encoded body" },
  { mime: "application/graphql", extensions: [], description: "GraphQL request" },
  { mime: "application/wasm", extensions: [".wasm"], description: "WebAssembly" },
  { mime: "application/vnd.android.package-archive", extensions: [".apk"], description: "Android package" },
  { mime: "text/plain", extensions: [".txt", ".log"], description: "Plain text" },
  { mime: "text/html", extensions: [".html", ".htm"], description: "HTML document" },
  { mime: "text/css", extensions: [".css"], description: "Cascading stylesheets" },
  { mime: "text/csv", extensions: [".csv"], description: "Comma-separated values" },
  { mime: "text/markdown", extensions: [".md", ".markdown"], description: "Markdown" },
  { mime: "text/yaml", extensions: [".yml", ".yaml"], description: "YAML" },
  { mime: "image/png", extensions: [".png"], description: "PNG image" },
  { mime: "image/jpeg", extensions: [".jpg", ".jpeg"], description: "JPEG image" },
  { mime: "image/gif", extensions: [".gif"], description: "GIF image" },
  { mime: "image/webp", extensions: [".webp"], description: "WebP image" },
  { mime: "image/svg+xml", extensions: [".svg"], description: "SVG vector image" },
  { mime: "image/x-icon", extensions: [".ico"], description: "Icon" },
  { mime: "audio/mpeg", extensions: [".mp3"], description: "MP3 audio" },
  { mime: "audio/wav", extensions: [".wav"], description: "WAV audio" },
  { mime: "video/mp4", extensions: [".mp4"], description: "MP4 video" },
  { mime: "video/webm", extensions: [".webm"], description: "WebM video" },
  { mime: "font/woff2", extensions: [".woff2"], description: "WOFF2 font" },
  { mime: "font/ttf", extensions: [".ttf"], description: "TrueType font" },
  { mime: "multipart/form-data", extensions: [], description: "Multipart form upload" },
];

export function lookupMime(query: string): MimeEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return MIME_TYPES;
  const ext = q.startsWith(".") ? q : `.${q}`;
  return MIME_TYPES.filter(
    (m) =>
      m.mime.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.extensions.some((e) => e.toLowerCase() === ext || e.toLowerCase().includes(q))
  );
}

export const DNS_TYPES = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "TXT",
  "NS",
  "SOA",
  "SRV",
  "CAA",
  "PTR",
] as const;

export type DnsType = (typeof DNS_TYPES)[number];

export interface DnsLookupResult {
  ok: boolean;
  error?: string;
  Status?: number;
  Answer?: { name: string; type: number; TTL: number; data: string }[];
  Authority?: { name: string; type: number; TTL: number; data: string }[];
  raw?: unknown;
}

const DNS_TYPE_CODES: Record<string, number> = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  MX: 15,
  TXT: 16,
  NS: 2,
  SOA: 6,
  SRV: 33,
  CAA: 257,
  PTR: 12,
};

export function dnsTypeName(code: number): string {
  const entry = Object.entries(DNS_TYPE_CODES).find(([, v]) => v === code);
  return entry?.[0] ?? String(code);
}

export async function lookupDns(
  name: string,
  type: DnsType
): Promise<DnsLookupResult> {
  const host = name.trim().replace(/^https?:\/\//, "").split("/")[0];
  if (!host) return { ok: false, error: "Enter a domain name." };

  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=${type}`;
    const res = await fetch(url, {
      headers: { Accept: "application/dns-json" },
    });
    if (!res.ok) {
      return { ok: false, error: `DNS query failed (${res.status})` };
    }
    const data = (await res.json()) as DnsLookupResult & { Status: number };
    return { ...data, ok: true, raw: data };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "DNS lookup failed",
    };
  }
}

export interface IpLookupResult {
  ok: boolean;
  error?: string;
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  country_name?: string;
  org?: string;
  asn?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  version?: string;
  raw?: unknown;
}

export async function lookupIp(ipOrEmpty: string): Promise<IpLookupResult> {
  const target = ipOrEmpty.trim();
  const endpoint = target
    ? `https://ipapi.co/${encodeURIComponent(target)}/json/`
    : "https://ipapi.co/json/";

  try {
    const res = await fetch(endpoint);
    const data = (await res.json()) as Record<string, unknown>;
    if (data.error) {
      return {
        ok: false,
        error: String(data.reason || data.error || "Lookup failed"),
      };
    }
    return {
      ok: true,
      ip: String(data.ip ?? target),
      city: data.city ? String(data.city) : undefined,
      region: data.region ? String(data.region) : undefined,
      country: data.country_code ? String(data.country_code) : undefined,
      country_name: data.country_name ? String(data.country_name) : undefined,
      org: data.org ? String(data.org) : undefined,
      asn: data.asn ? String(data.asn) : undefined,
      timezone: data.timezone ? String(data.timezone) : undefined,
      latitude: typeof data.latitude === "number" ? data.latitude : undefined,
      longitude: typeof data.longitude === "number" ? data.longitude : undefined,
      version: data.version ? String(data.version) : undefined,
      raw: data,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "IP lookup failed",
    };
  }
}

export interface ParsedUa {
  raw: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  isMobile: boolean;
  isBot: boolean;
}

export function parseUserAgent(ua: string): ParsedUa {
  const raw = ua.trim();
  const isBot = /bot|crawl|spider|slurp|bingpreview/i.test(raw);
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(raw);

  let browser = "Unknown";
  let browserVersion = "";
  const browserMatchers: [RegExp, string][] = [
    [/Edg\/([\d.]+)/i, "Edge"],
    [/OPR\/([\d.]+)/i, "Opera"],
    [/Chrome\/([\d.]+)/i, "Chrome"],
    [/Firefox\/([\d.]+)/i, "Firefox"],
    [/Version\/([\d.]+).*Safari/i, "Safari"],
    [/MSIE\s([\d.]+)/i, "IE"],
    [/Trident\/.*rv:([\d.]+)/i, "IE"],
  ];
  for (const [re, name] of browserMatchers) {
    const m = raw.match(re);
    if (m) {
      browser = name;
      browserVersion = m[1] ?? "";
      break;
    }
  }

  let os = "Unknown";
  let osVersion = "";
  if (/Windows NT 10/i.test(raw)) {
    os = "Windows";
    osVersion = "10/11";
  } else if (/Windows NT 6\.3/i.test(raw)) {
    os = "Windows";
    osVersion = "8.1";
  } else if (/Mac OS X ([\d_]+)/i.test(raw)) {
    os = "macOS";
    osVersion = (raw.match(/Mac OS X ([\d_]+)/i)?.[1] || "").replace(/_/g, ".");
  } else if (/Android ([\d.]+)/i.test(raw)) {
    os = "Android";
    osVersion = raw.match(/Android ([\d.]+)/i)?.[1] || "";
  } else if (/iPhone OS ([\d_]+)/i.test(raw) || /CPU OS ([\d_]+)/i.test(raw)) {
    os = /iPad/i.test(raw) ? "iPadOS" : "iOS";
    osVersion = (raw.match(/(?:iPhone OS|CPU OS) ([\d_]+)/i)?.[1] || "").replace(
      /_/g,
      "."
    );
  } else if (/Linux/i.test(raw)) {
    os = "Linux";
  } else if (/CrOS/i.test(raw)) {
    os = "Chrome OS";
  }

  let device = "Desktop";
  if (/iPad/i.test(raw)) device = "Tablet (iPad)";
  else if (/iPhone/i.test(raw)) device = "Mobile (iPhone)";
  else if (/Android/i.test(raw) && /Mobile/i.test(raw)) device = "Mobile (Android)";
  else if (/Android/i.test(raw)) device = "Tablet (Android)";
  else if (isMobile) device = "Mobile";

  let engine = "Unknown";
  if (/AppleWebKit/i.test(raw)) engine = "WebKit / Blink";
  if (/Gecko\//i.test(raw) && /Firefox/i.test(raw)) engine = "Gecko";
  if (/Chrome\//i.test(raw)) engine = "Blink";

  return {
    raw,
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    engine,
    isMobile,
    isBot,
  };
}

export interface ParsedUrl {
  ok: boolean;
  error?: string;
  href?: string;
  protocol?: string;
  username?: string;
  password?: string;
  host?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  origin?: string;
  params?: { key: string; value: string }[];
}

export function parseUrl(input: string): ParsedUrl {
  const trimmed = input.trim();
  if (!trimmed) return { ok: false, error: "Enter a URL." };

  try {
    // Allow bare domains
    const withProto = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    const u = new URL(withProto);
    const params: { key: string; value: string }[] = [];
    u.searchParams.forEach((value, key) => params.push({ key, value }));
    return {
      ok: true,
      href: u.href,
      protocol: u.protocol,
      username: u.username,
      password: u.password ? "••••••" : "",
      host: u.host,
      hostname: u.hostname,
      port: u.port || (u.protocol === "https:" ? "443" : u.protocol === "http:" ? "80" : ""),
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      origin: u.origin,
      params,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Invalid URL",
    };
  }
}
