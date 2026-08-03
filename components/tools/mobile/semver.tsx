"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
  OutputBlock,
} from "@/components/tools/mobile/shared";
import {
  bumpSemVer,
  formatSemVer,
  parseSemVer,
  type SemVerBump,
} from "@/lib/tools/mobile/versioning";

export default function SemverTool() {
  const [input, setInput] = useState("1.4.2-beta.1+build.8");
  const [prereleaseId, setPrereleaseId] = useState("beta");

  const parsed = useMemo(() => parseSemVer(input), [input]);

  const bumps = useMemo(() => {
    if (!parsed) return null;
    return {
      major: formatSemVer(bumpSemVer(parsed, "major")),
      minor: formatSemVer(bumpSemVer(parsed, "minor")),
      patch: formatSemVer(bumpSemVer(parsed, "patch")),
      prerelease: formatSemVer(bumpSemVer(parsed, "prerelease", prereleaseId)),
    };
  }, [parsed, prereleaseId]);

  const apply = (bump: SemVerBump) => {
    if (!parsed) return;
    setInput(formatSemVer(bumpSemVer(parsed, bump, prereleaseId)));
  };

  const report = parsed
    ? [
        `Current: ${formatSemVer(parsed)}`,
        ``,
        `major:      ${parsed.major}`,
        `minor:      ${parsed.minor}`,
        `patch:      ${parsed.patch}`,
        `prerelease: ${parsed.prerelease || "(none)"}`,
        `build:      ${parsed.build || "(none)"}`,
        ``,
        `Next major:      ${bumps?.major}`,
        `Next minor:      ${bumps?.minor}`,
        `Next patch:      ${bumps?.patch}`,
        `Next prerelease: ${bumps?.prerelease}`,
      ].join("\n")
    : "";

  return (
    <MobileToolShell
      title={
        <>
          Semantic <span className="neon-text">Version</span>
        </>
      }
      subtitle="Parse SemVer strings and bump major, minor, patch, or prerelease versions."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="semver.in" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="semver">Version</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="semver"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="1.2.3-beta.1+build.5"
                />
              </div>
            </div>
            <div className="mb-4">
              <FieldLabel htmlFor="preId">Prerelease id</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="preId"
                  value={prereleaseId}
                  onChange={(e) => setPrereleaseId(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {(["major", "minor", "patch", "prerelease"] as SemVerBump[]).map((b) => (
                <CyberButton
                  key={b}
                  type="button"
                  variant={b === "major" ? "glitch" : "outline"}
                  className="text-xs px-3 py-2"
                  disabled={!parsed}
                  onClick={() => apply(b)}
                >
                  Bump {b}
                </CyberButton>
              ))}
            </div>
            <CopyButton text={parsed ? formatSemVer(parsed) : ""} />
            {!parsed && (
              <p className="mt-3 font-mono text-xs text-destructive">
                {"> "}Invalid SemVer. Expected MAJOR.MINOR.PATCH[-pre][+build]
              </p>
            )}
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="semver.out" hoverEffect={false}>
            <OutputBlock value={report} />
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
