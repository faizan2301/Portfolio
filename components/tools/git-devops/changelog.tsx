"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
  buildChangelogSection,
  type ChangelogCategory,
  type ChangelogEntry,
} from "@/lib/tools/git-devops/generators";

const CATEGORIES: ChangelogCategory[] = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
];

export default function ChangelogTool() {
  const [version, setVersion] = useState("1.2.0");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState<ChangelogEntry[]>([
    { category: "Added", text: "Dark mode support" },
    { category: "Fixed", text: "Login redirect loop on Safari" },
  ]);

  const output = useMemo(
    () => buildChangelogSection(version, date, entries),
    [version, date, entries]
  );

  return (
    <GitDevopsToolShell
      title={
        <>
          Changelog <span className="neon-text">Generator</span>
        </>
      }
      subtitle="Produce Keep a Changelog sections from versioned notes across standard categories."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="release.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <FieldLabel htmlFor="ver">Version</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="ver"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <FieldLabel>Entries</FieldLabel>
              <CyberButton
                type="button"
                variant="outline"
                className="text-xs px-2 py-1"
                onClick={() =>
                  setEntries((e) => [...e, { category: "Added", text: "" }])
                }
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </CyberButton>
            </div>
            <div className="space-y-2 mb-4 max-h-[320px] overflow-auto">
              {entries.map((entry, i) => (
                <div key={i} className="grid grid-cols-[0.9fr_1.4fr_auto] gap-2">
                  <div className="cyber-input-wrap">
                    <select
                      value={entry.category}
                      onChange={(e) =>
                        setEntries((list) =>
                          list.map((row, idx) =>
                            idx === i
                              ? { ...row, category: e.target.value as ChangelogCategory }
                              : row
                          )
                        )
                      }
                      className="cyber-input w-full text-xs appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="cyber-input-wrap">
                    <input
                      value={entry.text}
                      onChange={(e) =>
                        setEntries((list) =>
                          list.map((row, idx) =>
                            idx === i ? { ...row, text: e.target.value } : row
                          )
                        )
                      }
                      className="cyber-input w-full text-xs"
                      placeholder="Describe the change"
                    />
                  </div>
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-destructive"
                    onClick={() => setEntries((list) => list.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <CopyButton text={output} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="CHANGELOG.md" hoverEffect={false}>
            <OutputBlock value={output} className="min-h-[360px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
