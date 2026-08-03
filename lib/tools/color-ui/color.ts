export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function normalizeHex(input: string): string | null {
  let hex = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) return `#${hex.toUpperCase()}`;
  if (/^[0-9a-fA-F]{8}$/.test(hex)) return `#${hex.toUpperCase()}`;
  return null;
}

export function hexToRgb(hex: string): Rgb | null {
  const n = normalizeHex(hex);
  if (!n) return null;
  return {
    r: Number.parseInt(n.slice(1, 3), 16),
    g: Number.parseInt(n.slice(3, 5), 16),
    b: Number.parseInt(n.slice(5, 7), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) =>
    clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0").toUpperCase();
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case rr:
      h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
      break;
    case gg:
      h = ((bb - rr) / d + 2) / 6;
      break;
    default:
      h = ((rr - gg) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hue2rgb(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hh = ((h % 360) + 360) % 360 / 360;
  const ss = clamp(s, 0, 100) / 100;
  const ll = clamp(l, 0, 100) / 100;
  if (ss === 0) {
    const v = Math.round(ll * 255);
    return { r: v, g: v, b: v };
  }
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  return {
    r: Math.round(hue2rgb(p, q, hh + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hh) * 255),
    b: Math.round(hue2rgb(p, q, hh - 1 / 3) * 255),
  };
}

export function formatRgb(rgb: Rgb, alpha?: number): string {
  if (alpha !== undefined && alpha < 1) {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Number(alpha.toFixed(2))})`;
  }
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsl(hsl: Hsl, alpha?: number): string {
  const h = Math.round(hsl.h);
  const s = Math.round(hsl.s);
  const l = Math.round(hsl.l);
  if (alpha !== undefined && alpha < 1) {
    return `hsla(${h}, ${s}%, ${l}%, ${Number(alpha.toFixed(2))})`;
  }
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function bestTextColor(bg: Rgb): string {
  return contrastRatio(bg, { r: 255, g: 255, b: 255 }) >=
    contrastRatio(bg, { r: 0, g: 0, b: 0 })
    ? "#FFFFFF"
    : "#000000";
}

/** Material-ish tonal palette by shifting lightness around a seed. */
export function generateMaterialPalette(seedHex: string): {
  tone: number;
  hex: string;
  rgb: Rgb;
}[] {
  const rgb = hexToRgb(seedHex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb);
  const tones = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  // Map tone → lightness (approx Material feel)
  const lightnessMap: Record<number, number> = {
    50: 95,
    100: 90,
    200: 80,
    300: 70,
    400: 60,
    500: 50,
    600: 42,
    700: 34,
    800: 26,
    900: 18,
  };

  return tones.map((tone) => {
    const targetL = lightnessMap[tone];
    // Keep hue; boost saturation slightly on mid tones
    const sat =
      tone === 50 || tone === 100
        ? Math.min(hsl.s, 40)
        : tone >= 800
          ? Math.min(100, hsl.s + 5)
          : Math.min(100, Math.max(hsl.s, 45));
    const next = hslToRgb({ h: hsl.h, s: sat, l: targetL });
    // For 500, bias toward original
    const mixed =
      tone === 500
        ? {
            r: Math.round(rgb.r * 0.65 + next.r * 0.35),
            g: Math.round(rgb.g * 0.65 + next.g * 0.35),
            b: Math.round(rgb.b * 0.65 + next.b * 0.35),
          }
        : next;
    return { tone, hex: rgbToHex(mixed), rgb: mixed };
  });
}

export type GradientType = "linear" | "radial";

export interface GradientStop {
  id: string;
  color: string;
  position: number;
}

export function buildGradientCss(
  type: GradientType,
  angle: number,
  stops: GradientStop[]
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopCss = sorted
    .map((s) => `${normalizeHex(s.color) ?? s.color} ${clamp(s.position, 0, 100)}%`)
    .join(", ");
  if (type === "radial") {
    return `radial-gradient(circle, ${stopCss})`;
  }
  return `linear-gradient(${angle}deg, ${stopCss})`;
}

export interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export function buildBoxShadowCss(layers: ShadowLayer[]): string {
  if (layers.length === 0) return "none";
  return layers
    .map((l) => {
      const color = normalizeHex(l.color) ?? l.color;
      const inset = l.inset ? "inset " : "";
      return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${color}`;
    })
    .join(", ");
}

export interface RadiusValues {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

export function buildBorderRadiusCss(r: RadiusValues): string {
  if (r.tl === r.tr && r.tr === r.br && r.br === r.bl) {
    return `border-radius: ${r.tl}px;`;
  }
  return `border-radius: ${r.tl}px ${r.tr}px ${r.br}px ${r.bl}px;`;
}

export interface GlassOptions {
  bgColor: string;
  opacity: number;
  blur: number;
  saturate: number;
  borderOpacity: number;
  borderWidth: number;
  radius: number;
}

export function buildGlassCss(opts: GlassOptions): string {
  const rgb = hexToRgb(opts.bgColor) ?? { r: 255, g: 255, b: 255 };
  const alpha = clamp(opts.opacity, 0, 1);
  const borderA = clamp(opts.borderOpacity, 0, 1);
  return [
    `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha});`,
    `backdrop-filter: blur(${opts.blur}px) saturate(${opts.saturate}%);`,
    `-webkit-backdrop-filter: blur(${opts.blur}px) saturate(${opts.saturate}%);`,
    `border: ${opts.borderWidth}px solid rgba(255, 255, 255, ${borderA});`,
    `border-radius: ${opts.radius}px;`,
  ].join("\n");
}
