"use client";

import { useMemo, useState } from "react";
import CyberCard from "@/components/ui/cyber-card";
import { RevealItem } from "@/components/ui/reveal";
import {
  CopyButton,
  FieldLabel,
  MobileToolShell,
  OutputBlock,
} from "@/components/tools/mobile/shared";
import {
  ADB_TEMPLATES,
  generateAdbCommand,
  type AdbTemplateId,
} from "@/lib/tools/mobile/adb-commands";
import { cn } from "@/lib/utils";

export default function AdbCommandsTool() {
  const [template, setTemplate] = useState<AdbTemplateId>("deep-link");
  const [packageName, setPackageName] = useState("com.example.app");
  const [apkPath, setApkPath] = useState("./app-release.apk");
  const [deepLink, setDeepLink] = useState("myapp://open/product/42");
  const [activity, setActivity] = useState("com.example.app/.MainActivity");
  const [deviceId, setDeviceId] = useState("");
  const [logTag, setLogTag] = useState("MyApp");
  const [permission, setPermission] = useState("android.permission.POST_NOTIFICATIONS");

  const command = useMemo(
    () =>
      generateAdbCommand(template, {
        packageName,
        apkPath,
        deepLink,
        activity,
        deviceId,
        logTag,
        permission,
      }),
    [template, packageName, apkPath, deepLink, activity, deviceId, logTag, permission]
  );

  return (
    <MobileToolShell
      title={
        <>
          ADB <span className="neon-text">Commands</span>
        </>
      }
      subtitle="Generate ready-to-run adb snippets for install, deep links, logcat, permissions, and more."
    >
      <RevealItem>
        <CyberCard variant="terminal" terminalTitle="templates.select" hoverEffect={false} className="mb-4 sm:mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ADB_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={cn(
                  "text-left p-3 border transition-all cyber-chamfer-sm",
                  template === t.id
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/30"
                )}
              >
                <span className="font-label text-[11px] uppercase tracking-widest block mb-1">
                  {t.label}
                </span>
                <span className="font-mono text-[11px] opacity-80">{t.description}</span>
              </button>
            ))}
          </div>
        </CyberCard>
      </RevealItem>

      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="params.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                ["Package", packageName, setPackageName],
                ["APK path", apkPath, setApkPath],
                ["Deep link", deepLink, setDeepLink],
                ["Activity", activity, setActivity],
                ["Device ID (-s)", deviceId, setDeviceId],
                ["Log tag", logTag, setLogTag],
                ["Permission", permission, setPermission],
              ].map(([label, value, setter]) => (
                <div key={label as string} className={label === "Permission" || label === "Deep link" ? "sm:col-span-2" : ""}>
                  <FieldLabel>{label as string}</FieldLabel>
                  <div className="cyber-input-wrap">
                    <input
                      value={value as string}
                      onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                      className="cyber-input w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="adb.sh" hoverEffect={false}>
            <div className="mb-3">
              <CopyButton text={command} />
            </div>
            <OutputBlock value={command} className="min-h-[240px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
