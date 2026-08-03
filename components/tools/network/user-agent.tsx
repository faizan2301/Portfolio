"use client";

import { useEffect, useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  NetworkToolShell,
  OutputBlock,
} from "@/components/tools/network/shared";
import { parseUserAgent } from "@/lib/tools/network/core";

export default function UserAgentTool() {
  const [ua, setUa] = useState("");

  useEffect(() => {
    setUa(navigator.userAgent);
  }, []);

  const parsed = useMemo(() => parseUserAgent(ua || " "), [ua]);

  const report = [
    `Browser:  ${parsed.browser} ${parsed.browserVersion}`.trim(),
    `OS:       ${parsed.os} ${parsed.osVersion}`.trim(),
    `Device:   ${parsed.device}`,
    `Engine:   ${parsed.engine}`,
    `Mobile:   ${parsed.isMobile ? "yes" : "no"}`,
    `Bot:      ${parsed.isBot ? "yes" : "no"}`,
    "",
    `Raw UA:`,
    parsed.raw,
  ].join("\n");

  return (
    <NetworkToolShell
      title={
        <>
          User Agent <span className="neon-text">Parser</span>
        </>
      }
      subtitle="Parse browser, OS, device, and engine details from any User-Agent string."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="ua.in" hoverEffect={false}>
            <FieldLabel htmlFor="ua">User-Agent</FieldLabel>
            <div className="cyber-input-wrap cyber-textarea-wrap mb-4">
              <textarea
                id="ua"
                value={ua}
                onChange={(e) => setUa(e.target.value)}
                rows={6}
                className="cyber-input cyber-textarea w-full text-xs font-mono resize-y"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-3 py-2"
                onClick={() => setUa(navigator.userAgent)}
              >
                Use mine
              </CyberButton>
              <CopyButton text={report} />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="parsed.out" hoverEffect={false}>
            <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs">
              <div className="border border-border/60 p-2">
                <span className="text-muted-foreground">Browser</span>
                <p>
                  {parsed.browser} {parsed.browserVersion}
                </p>
              </div>
              <div className="border border-border/60 p-2">
                <span className="text-muted-foreground">OS</span>
                <p>
                  {parsed.os} {parsed.osVersion}
                </p>
              </div>
              <div className="border border-border/60 p-2">
                <span className="text-muted-foreground">Device</span>
                <p>{parsed.device}</p>
              </div>
              <div className="border border-border/60 p-2">
                <span className="text-muted-foreground">Engine</span>
                <p>{parsed.engine}</p>
              </div>
            </div>
            <OutputBlock value={report} />
          </CyberCard>
        </div>
      </RevealItem>
    </NetworkToolShell>
  );
}
