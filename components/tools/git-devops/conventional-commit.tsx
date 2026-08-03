"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  GitDevopsToolShell,
  OutputBlock,
} from "@/components/tools/git-devops/shared";
import {
  COMMIT_TYPES,
  buildConventionalCommit,
} from "@/lib/tools/git-devops/generators";

export default function ConventionalCommitTool() {
  const [type, setType] = useState("feat");
  const [scope, setScope] = useState("api");
  const [description, setDescription] = useState("add user authentication");
  const [body, setBody] = useState("");
  const [breaking, setBreaking] = useState(false);
  const [breakingDescription, setBreakingDescription] = useState("");
  const [footers, setFooters] = useState("");

  const message = useMemo(
    () =>
      buildConventionalCommit({
        type,
        scope,
        description,
        body,
        breaking,
        breakingDescription,
        footers,
      }),
    [type, scope, description, body, breaking, breakingDescription, footers]
  );

  return (
    <GitDevopsToolShell
      title={
        <>
          Conventional <span className="neon-text">Commit</span>
        </>
      }
      subtitle="Compose Conventional Commits with type, scope, body, footers, and breaking changes."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="commit.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <div className="cyber-input-wrap">
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="cyber-input w-full text-sm appearance-none cursor-pointer"
                >
                  {COMMIT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label} — {t.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel htmlFor="scope">Scope</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="scope"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="cyber-input w-full text-sm"
                    placeholder="auth"
                  />
                </div>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={breaking}
                    onChange={(e) => setBreaking(e.target.checked)}
                    className="accent-primary"
                  />
                  Breaking change
                </label>
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel htmlFor="desc">Description</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel htmlFor="body">Body</FieldLabel>
              <div className="cyber-input-wrap cyber-textarea-wrap">
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  className="cyber-input cyber-textarea w-full text-sm resize-y"
                />
              </div>
            </div>
            {breaking && (
              <div className="mb-3">
                <FieldLabel htmlFor="bc">BREAKING CHANGE</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="bc"
                    value={breakingDescription}
                    onChange={(e) => setBreakingDescription(e.target.value)}
                    className="cyber-input w-full text-sm"
                    placeholder="Auth API now requires Bearer tokens"
                  />
                </div>
              </div>
            )}
            <div className="mb-4">
              <FieldLabel htmlFor="footers">Footers</FieldLabel>
              <div className="cyber-input-wrap cyber-textarea-wrap">
                <textarea
                  id="footers"
                  value={footers}
                  onChange={(e) => setFooters(e.target.value)}
                  rows={2}
                  className="cyber-input cyber-textarea w-full text-sm resize-y"
                  placeholder="Refs: #123"
                />
              </div>
            </div>
            <CopyButton text={message} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="message.out" hoverEffect={false}>
            <OutputBlock value={message} className="min-h-[320px]" />
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {"> "}git commit -m &quot;...&quot; — or paste multi-line via HEREDOC
            </p>
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
