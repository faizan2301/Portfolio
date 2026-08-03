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
  BRANCH_TYPES,
  buildBranchName,
} from "@/lib/tools/git-devops/generators";

export default function BranchNameTool() {
  const [type, setType] = useState("feature");
  const [ticket, setTicket] = useState("PROJ-123");
  const [description, setDescription] = useState("add auth flow");

  const branch = useMemo(
    () => buildBranchName(type, ticket, description),
    [type, ticket, description]
  );

  const commands = [
    `git checkout -b ${branch}`,
    `# or`,
    `git switch -c ${branch}`,
  ].join("\n");

  return (
    <GitDevopsToolShell
      title={
        <>
          Branch <span className="neon-text">Name</span>
        </>
      }
      subtitle="Generate consistent git branch names from type, ticket ID, and a short description."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="branch.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel htmlFor="btype">Type</FieldLabel>
              <div className="cyber-input-wrap">
                <select
                  id="btype"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="cyber-input w-full text-sm appearance-none cursor-pointer"
                >
                  {BRANCH_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel htmlFor="ticket">Ticket / issue (optional)</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="ticket"
                  value={ticket}
                  onChange={(e) => setTicket(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="JIRA-42"
                />
              </div>
            </div>
            <div className="mb-4">
              <FieldLabel htmlFor="bdesc">Description</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="bdesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="improve checkout speed"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={branch} label="Copy branch" />
              <CopyButton text={commands} label="Copy commands" />
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="branch.out" hoverEffect={false}>
            <p className="font-heading text-lg sm:text-xl tracking-wider neon-text mb-4 break-all">
              {branch || "—"}
            </p>
            <OutputBlock value={commands} />
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
