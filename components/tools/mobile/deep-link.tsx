"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
  OutputBlock,
} from "@/components/tools/mobile/shared";
import { buildDeepLink } from "@/lib/tools/mobile/deep-links";

export default function DeepLinkTool() {
  const [scheme, setScheme] = useState("myapp");
  const [host, setHost] = useState("open");
  const [path, setPath] = useState("/product/42");
  const [query, setQuery] = useState([{ key: "ref", value: "share" }]);

  const link = useMemo(
    () => buildDeepLink({ scheme, host, path, query }),
    [scheme, host, path, query]
  );

  return (
    <MobileToolShell
      title={
        <>
          Deep <span className="neon-text">Links</span>
        </>
      }
      subtitle="Compose custom-scheme / App Link URLs and open them for a quick sanity check."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="builder.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel htmlFor="scheme">Scheme</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="scheme"
                    value={scheme}
                    onChange={(e) => setScheme(e.target.value)}
                    className="cyber-input w-full text-sm"
                    placeholder="myapp"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="host">Host</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="host"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    className="cyber-input w-full text-sm"
                    placeholder="open"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel htmlFor="path">Path</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  id="path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="cyber-input w-full text-sm"
                  placeholder="/product/42"
                />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <FieldLabel>Query params</FieldLabel>
                <CyberButton
                  type="button"
                  variant="outline"
                  className="text-xs px-2 py-1"
                  onClick={() => setQuery((q) => [...q, { key: "", value: "" }])}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </CyberButton>
              </div>
              {query.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <div className="cyber-input-wrap">
                    <input
                      value={row.key}
                      onChange={(e) =>
                        setQuery((q) =>
                          q.map((r, idx) => (idx === i ? { ...r, key: e.target.value } : r))
                        )
                      }
                      className="cyber-input w-full text-sm"
                      placeholder="key"
                    />
                  </div>
                  <div className="cyber-input-wrap">
                    <input
                      value={row.value}
                      onChange={(e) =>
                        setQuery((q) =>
                          q.map((r, idx) => (idx === i ? { ...r, value: e.target.value } : r))
                        )
                      }
                      className="cyber-input w-full text-sm"
                      placeholder="value"
                    />
                  </div>
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-destructive"
                    onClick={() => setQuery((q) => q.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton text={link} />
              <CyberButton
                type="button"
                variant="glitch"
                className="text-xs px-3 py-2"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Test / Open
              </CyberButton>
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="deeplink.out" hoverEffect={false}>
            <OutputBlock value={link} />
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {"> "}Custom schemes only open if an app handles them on this device/browser.
            </p>
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
