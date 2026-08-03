"use client";

import { useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
  OutputBlock,
} from "@/components/tools/mobile/shared";
import {
  fingerprintsFromPemOrFile,
  keytoolHint,
  type CertificateFingerprints,
} from "@/lib/tools/mobile/apk-signature";

export default function ApkSignatureTool() {
  const [pem, setPem] = useState("");
  const [result, setResult] = useState<CertificateFingerprints | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const compute = async (input: string | ArrayBuffer) => {
    setBusy(true);
    setError(null);
    try {
      const fp = await fingerprintsFromPemOrFile(input);
      setResult(fp);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Failed to compute fingerprints");
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    const buffer = await file.arrayBuffer();
    // If text pem, prefer text path
    if (file.name.match(/\.pem$/i) || file.type.includes("text")) {
      const text = new TextDecoder().decode(buffer);
      setPem(text);
      await compute(text);
    } else {
      setPem(`(uploaded binary: ${file.name})`);
      await compute(buffer);
    }
  };

  const output = result
    ? [
        `SHA-1:        ${result.sha1Colon}`,
        `SHA-256:      ${result.sha256Colon}`,
        ``,
        `SHA-1 hex:    ${result.sha1}`,
        `SHA-256 hex:  ${result.sha256}`,
        ``,
        `SHA-1 Base64 (Facebook):   ${result.sha1Base64}`,
        `SHA-256 Base64:            ${result.sha256Base64}`,
        ``,
        `Certificate bytes: ${result.byteLength}`,
      ].join("\n")
    : "";

  return (
    <MobileToolShell
      title={
        <>
          APK <span className="neon-text">Signatures</span>
        </>
      }
      subtitle="Upload a certificate (.cer/.crt/.der/.pem) or paste PEM to get SHA-1 and SHA-256 fingerprints."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="certificate.in" hoverEffect={false}>
            <FieldLabel htmlFor="certFile">Upload certificate</FieldLabel>
            <input
              id="certFile"
              type="file"
              accept=".pem,.cer,.crt,.der,.cert"
              className="block w-full text-xs font-mono text-muted-foreground mb-4 file:mr-3 file:py-2 file:px-3 file:border file:border-primary/40 file:bg-primary/10 file:text-primary file:font-label file:text-[10px] file:uppercase file:tracking-widest"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            <FieldLabel htmlFor="pem">Or paste PEM</FieldLabel>
            <div className="cyber-input-wrap cyber-textarea-wrap mb-3">
              <textarea
                id="pem"
                value={pem.startsWith("(uploaded") ? "" : pem}
                onChange={(e) => setPem(e.target.value)}
                rows={10}
                spellCheck={false}
                className="cyber-input cyber-textarea w-full text-xs font-mono resize-y"
                placeholder="-----BEGIN CERTIFICATE-----"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => compute(pem)}
                className="cyber-btn cyber-btn-glitch text-xs px-3 py-2"
              >
                {busy ? "Computing..." : "Generate"}
              </button>
              <CopyButton text={output} />
            </div>
            {error && (
              <p className="mt-3 font-mono text-xs text-destructive">{"> "}{error}</p>
            )}
            <pre className="mt-4 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap border-t border-border/50 pt-3">
              {keytoolHint()}
            </pre>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="fingerprints.out" hoverEffect={false}>
            <OutputBlock value={output} />
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
