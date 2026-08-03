"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
} from "@/components/tools/mobile/shared";

export default function QrDeepLinkTool() {
  const [url, setUrl] = useState("myapp://open/product/42?ref=qr");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!url.trim()) {
          setDataUrl("");
          return;
        }
        const next = await QRCode.toDataURL(url.trim(), {
          width: 512,
          margin: 2,
          color: { dark: "#00ff88", light: "#0a0a0f" },
        });
        if (!cancelled) {
          setDataUrl(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to generate QR");
          setDataUrl("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <MobileToolShell
      title={
        <>
          QR <span className="neon-text">Deep Links</span>
        </>
      }
      subtitle="Generate a scannable QR code for deep links, App Links, or Universal Links."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="link.in" hoverEffect={false}>
            <FieldLabel htmlFor="qrUrl">Deep link / URL</FieldLabel>
            <div className="cyber-input-wrap cyber-textarea-wrap mb-4">
              <textarea
                id="qrUrl"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                rows={4}
                className="cyber-input cyber-textarea w-full text-sm font-mono resize-y"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={url} label="Copy URL" />
              {dataUrl && (
                <a
                  href={dataUrl}
                  download="deeplink-qr.png"
                  className="cyber-btn cyber-btn-outline text-xs px-3 py-2"
                >
                  Download PNG
                </a>
              )}
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-destructive">{"> "}{error}</p>
            )}
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="qr.out" hoverEffect={false}>
            <div className="flex items-center justify-center min-h-[280px] border border-border/60 bg-background/40 p-6">
              {dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dataUrl} alt="Deep link QR code" className="w-full max-w-[280px]" />
              ) : (
                <p className="font-mono text-xs text-muted-foreground">Enter a URL to generate QR</p>
              )}
            </div>
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
