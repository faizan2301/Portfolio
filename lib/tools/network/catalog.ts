import type { LucideIcon } from "lucide-react";
import {
  FileType,
  Globe,
  Link2,
  MapPin,
  ScanSearch,
  ServerCrash,
} from "lucide-react";

export type NetworkToolMeta = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const NETWORK_TOOLS: NetworkToolMeta[] = [
  {
    slug: "http-status",
    name: "HTTP Status Code Lookup",
    description: "Search HTTP status codes with meaning, category, and typical use.",
    icon: ServerCrash,
  },
  {
    slug: "mime-type",
    name: "MIME Type Lookup",
    description: "Find MIME types by extension or content type for APIs and uploads.",
    icon: FileType,
  },
  {
    slug: "dns-lookup",
    name: "DNS Record Checker",
    description: "Query A, AAAA, CNAME, MX, TXT, NS, and more via DNS-over-HTTPS.",
    icon: Globe,
  },
  {
    slug: "ip-lookup",
    name: "IP Address Lookup",
    description: "Look up geolocation and network details for an IP address.",
    icon: MapPin,
  },
  {
    slug: "user-agent",
    name: "User Agent Parser",
    description: "Parse browser, OS, device, and engine details from a UA string.",
    icon: ScanSearch,
  },
  {
    slug: "url-parser",
    name: "URL Parser",
    description: "Break a URL into protocol, host, path, query params, and hash.",
    icon: Link2,
  },
];
