import type { LucideIcon } from "lucide-react";
import {
  Aperture,
  Contrast,
  Image,
  Maximize2,
  Ruler,
  Type,
  Wand2,
} from "lucide-react";

export type RnFlutterToolMeta = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const RN_FLUTTER_TOOLS: RnFlutterToolMeta[] = [
  {
    slug: "responsive-font",
    name: "Responsive Font Size",
    description: "Scale font sizes across screen widths for RN and Flutter layouts.",
    icon: Type,
  },
  {
    slug: "dp-px",
    name: "dp ↔ px Converter",
    description: "Convert between density-independent pixels and physical pixels.",
    icon: Ruler,
  },
  {
    slug: "rem-px",
    name: "rem ↔ px Converter",
    description: "Convert rem units to pixels (and back) with a configurable root size.",
    icon: Maximize2,
  },
  {
    slug: "rn-style",
    name: "React Native Style Generator",
    description: "Build StyleSheet snippets for padding, radius, shadows, and typography.",
    icon: Wand2,
  },
  {
    slug: "flutter-theme",
    name: "Flutter Theme Generator",
    description: "Generate a ThemeData / ColorScheme starter from your brand colors.",
    icon: Contrast,
  },
  {
    slug: "app-icon-sizes",
    name: "App Icon Size Generator",
    description: "List required iOS & Android app icon dimensions from a base size.",
    icon: Image,
  },
  {
    slug: "splash-preview",
    name: "Splash Screen Preview",
    description: "Preview splash layouts for phone frames with color and logo size controls.",
    icon: Aperture,
  },
];
