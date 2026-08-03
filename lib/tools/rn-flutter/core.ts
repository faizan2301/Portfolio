export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function round(n: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

/** Scale font from design width to target width (common RN/Flutter pattern). */
export function scaleFont(
  designSize: number,
  designWidth: number,
  targetWidth: number,
  min?: number,
  max?: number
): number {
  if (designWidth <= 0) return designSize;
  let scaled = (designSize * targetWidth) / designWidth;
  if (min !== undefined) scaled = Math.max(min, scaled);
  if (max !== undefined) scaled = Math.min(max, scaled);
  return round(scaled, 2);
}

export function dpToPx(dp: number, density: number): number {
  return round(dp * density, 2);
}

export function pxToDp(px: number, density: number): number {
  if (density === 0) return 0;
  return round(px / density, 2);
}

export const COMMON_DENSITIES = [
  { id: "ldpi", label: "ldpi (0.75x)", density: 0.75 },
  { id: "mdpi", label: "mdpi (1x)", density: 1 },
  { id: "hdpi", label: "hdpi (1.5x)", density: 1.5 },
  { id: "xhdpi", label: "xhdpi (2x)", density: 2 },
  { id: "xxhdpi", label: "xxhdpi (3x)", density: 3 },
  { id: "xxxhdpi", label: "xxxhdpi (4x)", density: 4 },
  { id: "ios2", label: "iOS @2x", density: 2 },
  { id: "ios3", label: "iOS @3x", density: 3 },
] as const;

export function remToPx(rem: number, rootPx: number): number {
  return round(rem * rootPx, 2);
}

export function pxToRem(px: number, rootPx: number): number {
  if (rootPx === 0) return 0;
  return round(px / rootPx, 4);
}

export interface RnStyleOptions {
  padding: number;
  margin: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: "400" | "500" | "600" | "700";
  backgroundColor: string;
  color: string;
  shadow: boolean;
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export function buildRnStyle(opts: RnStyleOptions): string {
  const lines = [
    "import { StyleSheet } from 'react-native';",
    "",
    "export const styles = StyleSheet.create({",
    "  container: {",
    `    padding: ${opts.padding},`,
    `    margin: ${opts.margin},`,
    `    borderRadius: ${opts.borderRadius},`,
    `    backgroundColor: '${opts.backgroundColor}',`,
  ];

  if (opts.shadow) {
    lines.push(
      "    // iOS shadow",
      "    shadowColor: '#000',",
      "    shadowOffset: { width: 0, height: 2 },",
      `    shadowOpacity: ${opts.shadowOpacity},`,
      `    shadowRadius: ${opts.shadowRadius},`,
      "    // Android elevation",
      `    elevation: ${opts.elevation},`
    );
  }

  lines.push(
    "  },",
    "  text: {",
    `    fontSize: ${opts.fontSize},`,
    `    fontWeight: '${opts.fontWeight}',`,
    `    color: '${opts.color}',`,
    "  },",
    "});",
    ""
  );

  return lines.join("\n");
}

export interface FlutterThemeOptions {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  brightness: "light" | "dark";
  fontFamily: string;
  useMaterial3: boolean;
}

export function buildFlutterTheme(opts: FlutterThemeOptions): string {
  const brightness = opts.brightness === "dark" ? "Brightness.dark" : "Brightness.light";
  return `import 'package:flutter/material.dart';

ThemeData buildAppTheme() {
  const primary = Color(0xFF${opts.primary.replace("#", "").toUpperCase()});
  const secondary = Color(0xFF${opts.secondary.replace("#", "").toUpperCase()});
  const background = Color(0xFF${opts.background.replace("#", "").toUpperCase()});
  const surface = Color(0xFF${opts.surface.replace("#", "").toUpperCase()});
  const error = Color(0xFF${opts.error.replace("#", "").toUpperCase()});

  final scheme = ColorScheme.fromSeed(
    seedColor: primary,
    brightness: ${brightness},
    primary: primary,
    secondary: secondary,
    surface: surface,
    error: error,
  );

  return ThemeData(
    useMaterial3: ${opts.useMaterial3},
    colorScheme: scheme,
    scaffoldBackgroundColor: background,
    fontFamily: '${opts.fontFamily || "Roboto"}',
    appBarTheme: AppBarTheme(
      backgroundColor: primary,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
  );
}
`;
}

export interface IconSizeSpec {
  platform: "iOS" | "Android" | "Web";
  name: string;
  size: number;
  idiom?: string;
}

export function generateIconSizes(base: number): IconSizeSpec[] {
  const specs: IconSizeSpec[] = [
    { platform: "iOS", name: "20pt @2x", size: 40, idiom: "Notifications" },
    { platform: "iOS", name: "20pt @3x", size: 60, idiom: "Notifications" },
    { platform: "iOS", name: "29pt @2x", size: 58, idiom: "Settings" },
    { platform: "iOS", name: "29pt @3x", size: 87, idiom: "Settings" },
    { platform: "iOS", name: "40pt @2x", size: 80, idiom: "Spotlight" },
    { platform: "iOS", name: "40pt @3x", size: 120, idiom: "Spotlight" },
    { platform: "iOS", name: "60pt @2x", size: 120, idiom: "App" },
    { platform: "iOS", name: "60pt @3x", size: 180, idiom: "App" },
    { platform: "iOS", name: "App Store", size: 1024, idiom: "Marketing" },
    { platform: "Android", name: "mdpi", size: 48 },
    { platform: "Android", name: "hdpi", size: 72 },
    { platform: "Android", name: "xhdpi", size: 96 },
    { platform: "Android", name: "xxhdpi", size: 144 },
    { platform: "Android", name: "xxxhdpi", size: 192 },
    { platform: "Android", name: "Play Store", size: 512 },
    { platform: "Web", name: "favicon", size: 32 },
    { platform: "Web", name: "PWA 192", size: 192 },
    { platform: "Web", name: "PWA 512", size: 512 },
  ];

  if (base > 0 && base !== 1024) {
    return [
      {
        platform: "iOS",
        name: "Master source (yours)",
        size: base,
        idiom: "Recommended export",
      },
      ...specs,
    ];
  }

  return specs;
}

export function buildIconSizeMarkdown(base: number): string {
  const sizes = generateIconSizes(base);
  const lines = [
    `# App icon sizes (master ${base}×${base})`,
    "",
    "| Platform | Name | Size (px) | Notes |",
    "|----------|------|-----------|-------|",
  ];
  for (const s of sizes) {
    lines.push(
      `| ${s.platform} | ${s.name} | ${s.size}×${s.size} | ${s.idiom ?? ""} |`
    );
  }
  lines.push(
    "",
    "Tip: Export a square PNG/SVG master (1024×1024 or larger), then downscale — don't upscale."
  );
  return lines.join("\n");
}
