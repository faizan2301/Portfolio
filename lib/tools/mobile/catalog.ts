import type { LucideIcon } from "lucide-react";
import {
  Binary,
  Fingerprint,
  Link2,
  MessageSquare,
  QrCode,
  Send,
  Shield,
  Smartphone,
  Tag,
  Terminal,
} from "lucide-react";

export type MobileToolMeta = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const MOBILE_TOOLS: MobileToolMeta[] = [
  {
    slug: "apk-signature",
    name: "APK Signature Generator",
    description: "Compute SHA-1 / SHA-256 certificate fingerprints for Firebase, Maps, and Facebook.",
    icon: Fingerprint,
  },
  {
    slug: "deep-link",
    name: "Deep Link Generator & Tester",
    description: "Build custom-scheme and App Link URLs, then open them for a quick test.",
    icon: Link2,
  },
  {
    slug: "intent-uri",
    name: "Android Intent URI Generator",
    description: "Create intent:// URIs with package, action, categories, and extras.",
    icon: Send,
  },
  {
    slug: "universal-links",
    name: "iOS Universal Links Validator",
    description: "Validate apple-app-site-association JSON and path matching rules.",
    icon: Shield,
  },
  {
    slug: "fcm-payload",
    name: "FCM Payload Generator",
    description: "Build Firebase Cloud Messaging notification and data message JSON.",
    icon: MessageSquare,
  },
  {
    slug: "qr-deep-link",
    name: "QR Code for Deep Links",
    description: "Generate a scannable QR code from any deep link or App Link URL.",
    icon: QrCode,
  },
  {
    slug: "adb-commands",
    name: "ADB Command Generator",
    description: "Generate ready-to-run adb install, deep-link, logcat, and device commands.",
    icon: Terminal,
  },
  {
    slug: "permissions",
    name: "Manifest Permission Finder",
    description: "Search Android permissions with protection level and manifest snippets.",
    icon: Binary,
  },
  {
    slug: "version-code",
    name: "Version Code Calculator",
    description: "Map versionName to versionCode with common Android strategies.",
    icon: Tag,
  },
  {
    slug: "semver",
    name: "Semantic Version Generator",
    description: "Parse and bump major, minor, patch, prerelease, and build metadata.",
    icon: Smartphone,
  },
];

export function getMobileTool(slug: string): MobileToolMeta | undefined {
  return MOBILE_TOOLS.find((t) => t.slug === slug);
}
