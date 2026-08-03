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
import {
  DNS_TYPES,
  dnsTypeName,
  lookupDns,
  type DnsType,
} from "@/lib/tools/network/core";

export default function DnsLookupTool() {
  const [domain, setDomain] = useState("example.com");
  const [type, setType] = useState<DnsType>("A");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const run = async () => {
    setPending(true);
    setError(null);
    try {
      const result = await lookupDns(domain, type);
      if (!result.ok) {
        setError(result.error || "Lookup failed");
        setOutput("");
        return;
      }
      const answers = result.Answer ?? [];
      const lines = [
        `Query: ${domain.trim()} (${type})`,
        `Status: ${result.Status ?? "n/a"}`,
        "",
        answers.length ? "Answers:" : "No answers in response.",
        ...answers.map(
          (a) =>
            `  ${a.name}  ${dnsTypeName(a.type)}  TTL=${a.TTL}  ${a.data}`
        ),
      ];
      if (result.Authority?.length) {
        lines.push("", "Authority:");
        for (const a of result.Authority) {
          lines.push(
            `  ${a.name}  ${dnsTypeName(a.type)}  TTL=${a.TTL}  ${a.data}`
          );
        }
      }
      setOutput(lines.join("\n"));
    } finally {
      setPending(false);
    }
  };

  return (
    <NetworkToolShell
      title={
        <>
          DNS <span className="neon-text">Lookup</span>
        </>
      }
      subtitle="Query public DNS records over HTTPS (Cloudflare) — A, AAAA, MX, TXT, and more."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="query.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="domain">Domain</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="example.com"
                />
              </div>
            </div>
            <div className="mb-4">
              <FieldLabel htmlFor="dtype">Record type</FieldLabel>
              <div className="cyber-input-wrap">
                <select
                  id="dtype"
                  value={type}
                  onChange={(e) => setType(e.target.value as DnsType)}
                  className="cyber-input w-full text-sm appearance-none cursor-pointer"
                >
                  {DNS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <CyberButton
                type="button"
                variant="glitch"
                className="text-xs px-3 py-2"
                onClick={run}
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Querying...
                  </>
                ) : (
                  "Lookup"
                )}
              </CyberButton>
              <CopyButton text={output} />
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-destructive">{"> "}{error}</p>
            )}
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {"> "}Uses Cloudflare DNS-over-HTTPS from your browser.
            </p>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="dns.out" hoverEffect={false}>
            <OutputBlock value={output} className="min-h-[280px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </NetworkToolShell>
  );
}
