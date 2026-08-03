"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  NetworkToolShell,
  OutputBlock,
} from "@/components/tools/network/shared";
import { lookupIp } from "@/lib/tools/network/core";

export default function IpLookupTool() {
  const [ip, setIp] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const run = async (target?: string) => {
    setPending(true);
    setError(null);
    try {
      const result = await lookupIp(target ?? ip);
      if (!result.ok) {
        setError(result.error || "Lookup failed");
        setOutput("");
        return;
      }
      const lines = [
        `IP:        ${result.ip}`,
        `Version:   ${result.version ?? "n/a"}`,
        `City:      ${result.city ?? "n/a"}`,
        `Region:    ${result.region ?? "n/a"}`,
        `Country:   ${result.country_name ?? result.country ?? "n/a"}`,
        `Org:       ${result.org ?? "n/a"}`,
        `ASN:       ${result.asn ?? "n/a"}`,
        `Timezone:  ${result.timezone ?? "n/a"}`,
        `Lat/Lng:   ${result.latitude ?? "n/a"}, ${result.longitude ?? "n/a"}`,
      ].join("\n");
      setOutput(lines);
      if (result.ip) setIp(result.ip);
    } finally {
      setPending(false);
    }
  };

  return (
    <NetworkToolShell
      title={
        <>
          IP <span className="neon-text">Lookup</span>
        </>
      }
      subtitle="Resolve geolocation and network metadata for any IP — or detect your current address."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="ip.cfg" hoverEffect={false}>
            <FieldLabel htmlFor="ip">IP address (leave empty for yours)</FieldLabel>
            <div className="cyber-input-wrap mb-4">
              <input
                id="ip"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className="cyber-input w-full text-sm font-mono"
                placeholder="8.8.8.8"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <CyberButton
                type="button"
                variant="glitch"
                className="text-xs px-3 py-2"
                onClick={() => run()}
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Looking up...
                  </>
                ) : (
                  "Lookup"
                )}
              </CyberButton>
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => run("")}
                disabled={pending}
              >
                My IP
              </CyberButton>
              <CopyButton text={output} />
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-destructive">{"> "}{error}</p>
            )}
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {"> "}Powered by ipapi.co — rate limits may apply.
            </p>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="geo.out" hoverEffect={false}>
            <OutputBlock value={output} className="min-h-[280px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </NetworkToolShell>
  );
}
