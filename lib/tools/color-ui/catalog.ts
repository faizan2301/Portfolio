import type { LucideIcon } from "lucide-react";
import {
  Blend,
  Box,
  Droplets,
  Palette,
  Pipette,
  Sparkles,
  Squircle,
} from "lucide-react";

export type ColorUiToolMeta = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const COLOR_UI_TOOLS: ColorUiToolMeta[] = [
  {
    slug: "color-picker",
    name: "Color Picker",
    description: "Pick a color and copy HEX, RGB, HSL, and CSS variables instantly.",
    icon: Pipette,
  },
  {
    slug: "color-converter",
    name: "HEX ↔ RGB ↔ HSL",
    description: "Convert between HEX, RGB, and HSL color formats in real time.",
    icon: Blend,
  },
  {
    slug: "material-palette",
    name: "Material Palette Generator",
    description: "Generate a Material-style tonal palette from a primary seed color.",
    icon: Palette,
  },
  {
    slug: "gradient",
    name: "Gradient Generator",
    description: "Build linear and radial CSS gradients with live preview.",
    icon: Droplets,
  },
  {
    slug: "box-shadow",
    name: "Box Shadow Generator",
    description: "Craft layered box-shadows with offset, blur, spread, and color.",
    icon: Box,
  },
  {
    slug: "border-radius",
    name: "Border Radius Generator",
    description: "Tune corner radii individually or together and copy the CSS.",
    icon: Squircle,
  },
  {
    slug: "glassmorphism",
    name: "Glassmorphism Generator",
    description: "Generate frosted-glass CSS with blur, opacity, and border controls.",
    icon: Sparkles,
  },
];
