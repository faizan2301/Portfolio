"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  GitDevopsToolShell,
  OutputBlock,
} from "@/components/tools/git-devops/shared";
import {
  bumpTag,
  buildTagCommands,
  parseTagVersion,
  type TagBump,
} from "@/lib/tools/git-devops/generators";

export default function GitTagTool() {
  const [current, setCurrent] = useState("v1.2.3");
  const [message, setMessage] = useState("Release v1.2.4");
  const [annotated, setAnnotated] = useState(true);
  const [prereleaseId, setPrereleaseId] = useState("rc");

  const parsed = useMemo(() => parseTagVersion(current), [current]);
  const next = useMemo(
    () => ({
      major: bumpTag(current, "major"),
      minor: bumpTag(current, "minor"),
      patch: bumpTag(current, "patch"),
      prerelease: bumpTag(current, "prerelease", prereleaseId),
    }),
    [current, prereleaseId]
  );

  const [selected, setSelected] = useState(current);
  const commands = useMemo(
    () => buildTagCommands(selected, message, annotated),
    [selected, message, annotated]
  );

  const apply = (bump: TagBump) => {
    const tag = bumpTag(current, bump, prereleaseId);
    if (!tag) return;
    setSelected(tag);
    setMessage(`Release ${tag}`);
  };

  return (
    <GitDevopsToolShell
      title={
        <>
          Git <span className="neon-text">Tag</span>
        </>
      }
      subtitle="Bump SemVer tags and generate annotated or lightweight git tag commands."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="tag.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="current">Current tag</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="current"
                  value={current}
                  onChange={(e) => {
                    setCurrent(e.target.value);
                    setSelected(e.target.value);
                  }}
                  className="cyber-input w-full text-sm font-mono"
                  placeholder="v1.0.0"
                />
              </div>
              {!parsed && (
                <p className="mt-2 font-mono text-xs text-destructive">
                  {"> "}Expected vMAJOR.MINOR.PATCH[-prerelease]
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {(["major", "minor", "patch", "prerelease"] as TagBump[]).map((b) => (
                <CyberButton
                  key={b}
                  type="button"
                  variant={b === "major" ? "glitch" : "outline"}
                  className="text-xs px-3 py-2"
                  disabled={!parsed}
                  onClick={() => apply(b)}
                >
                  {b} → {next[b]}
                </CyberButton>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel htmlFor="selected">Tag to create</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="selected"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="cyber-input w-full text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="pre">Prerelease id</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="pre"
                    value={prereleaseId}
                    onChange={(e) => setPrereleaseId(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel htmlFor="msg">Tag message</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 font-mono text-xs cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={annotated}
                onChange={(e) => setAnnotated(e.target.checked)}
                className="accent-primary"
              />
              Annotated tag (-a)
            </label>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={selected} label="Copy tag" />
              <CopyButton text={commands} label="Copy commands" />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="git.sh" hoverEffect={false}>
            <OutputBlock value={commands} className="min-h-[280px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
