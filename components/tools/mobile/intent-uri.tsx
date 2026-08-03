"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CyberCard from "@/components/ui/cyber-card";
import { CyberButton } from "@/components/ui/cyber-button";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
  OutputBlock,
} from "@/components/tools/mobile/shared";
import { buildIntentUri } from "@/lib/tools/mobile/deep-links";

type Extra = { key: string; value: string; type: "string" | "int" | "bool" };

export default function IntentUriTool() {
  const [scheme, setScheme] = useState("https");
  const [host, setHost] = useState("example.com");
  const [path, setPath] = useState("/product/42");
  const [packageName, setPackageName] = useState("com.example.app");
  const [action, setAction] = useState("android.intent.action.VIEW");
  const [category, setCategory] = useState("android.intent.category.BROWSABLE");
  const [fallbackUrl, setFallbackUrl] = useState("https://example.com/product/42");
  const [extras, setExtras] = useState<Extra[]>([
    { key: "utm_source", value: "qr", type: "string" },
  ]);

  const uri = useMemo(
    () =>
      buildIntentUri({
        scheme,
        host,
        path,
        packageName,
        action,
        category,
        fallbackUrl,
        extras,
      }),
    [scheme, host, path, packageName, action, category, fallbackUrl, extras]
  );

  return (
    <MobileToolShell
      title={
        <>
          Intent <span className="neon-text">URI</span>
        </>
      }
      subtitle="Generate Android intent:// URIs with package targeting, actions, and typed extras."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="intent.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              {[
                ["scheme", scheme, setScheme],
                ["host", host, setHost],
                ["path", path, setPath],
                ["package", packageName, setPackageName],
              ].map(([label, value, setter]) => (
                <div key={label as string}>
                  <FieldLabel>{label as string}</FieldLabel>
                  <div className="cyber-input-wrap">
                    <input
                      value={value as string}
                      onChange={(e) =>
                        (setter as (v: string) => void)(e.target.value)
                      }
                      className="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-3">
              <FieldLabel>Action</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel>Category</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel>Browser fallback URL</FieldLabel>
              <div className="cyber-input-wrap">
                <input
                  value={fallbackUrl}
                  onChange={(e) => setFallbackUrl(e.target.value)}
                  className="cyber-input w-full text-sm"
                />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <FieldLabel>Extras</FieldLabel>
                <CyberButton
                  type="button"
                  variant="outline"
                  className="text-xs px-2 py-1"
                  onClick={() =>
                    setExtras((e) => [...e, { key: "", value: "", type: "string" }])
                  }
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </CyberButton>
              </div>
              {extras.map((row, i) => (
                <div key={i} className="grid grid-cols-[0.8fr_1fr_0.7fr_auto] gap-2">
                  <div className="cyber-input-wrap">
                    <input
                      value={row.key}
                      onChange={(e) =>
                        setExtras((list) =>
                          list.map((r, idx) =>
                            idx === i ? { ...r, key: e.target.value } : r
                          )
                        )
                      }
                      className="cyber-input w-full text-xs"
                      placeholder="key"
                    />
                  </div>
                  <div className="cyber-input-wrap">
                    <input
                      value={row.value}
                      onChange={(e) =>
                        setExtras((list) =>
                          list.map((r, idx) =>
                            idx === i ? { ...r, value: e.target.value } : r
                          )
                        )
                      }
                      className="cyber-input w-full text-xs"
                      placeholder="value"
                    />
                  </div>
                  <div className="cyber-input-wrap">
                    <select
                      value={row.type}
                      onChange={(e) =>
                        setExtras((list) =>
                          list.map((r, idx) =>
                            idx === i
                              ? { ...r, type: e.target.value as Extra["type"] }
                              : r
                          )
                        )
                      }
                      className="cyber-input w-full text-xs appearance-none cursor-pointer"
                    >
                      <option value="string">string</option>
                      <option value="int">int</option>
                      <option value="bool">bool</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-destructive"
                    onClick={() => setExtras((list) => list.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <CopyButton text={uri} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="intent.out" hoverEffect={false}>
            <OutputBlock value={uri} />
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
