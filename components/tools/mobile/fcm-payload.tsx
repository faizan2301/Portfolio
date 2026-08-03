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
import { buildFcmPayload } from "@/lib/tools/mobile/fcm-payload";

export default function FcmPayloadTool() {
  const [mode, setMode] = useState<"notification" | "data" | "both">("both");
  const [title, setTitle] = useState("New message");
  const [body, setBody] = useState("You have a new notification");
  const [image, setImage] = useState("");
  const [token, setToken] = useState("");
  const [topic, setTopic] = useState("news");
  const [sound, setSound] = useState("default");
  const [clickAction, setClickAction] = useState("FLUTTER_NOTIFICATION_CLICK");
  const [androidChannelId, setAndroidChannelId] = useState("default_channel");
  const [priority, setPriority] = useState<"normal" | "high">("high");
  const [dataPairs, setDataPairs] = useState([
    { key: "screen", value: "home" },
    { key: "id", value: "42" },
  ]);

  const json = useMemo(
    () =>
      JSON.stringify(
        buildFcmPayload({
          mode,
          title,
          body,
          image,
          token,
          topic,
          sound,
          clickAction,
          androidChannelId,
          priority,
          dataPairs,
        }),
        null,
        2
      ),
    [
      mode,
      title,
      body,
      image,
      token,
      topic,
      sound,
      clickAction,
      androidChannelId,
      priority,
      dataPairs,
    ]
  );

  return (
    <MobileToolShell
      title={
        <>
          FCM <span className="neon-text">Payload</span>
        </>
      }
      subtitle="Build Firebase Cloud Messaging HTTP v1 notification and data payloads."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="fcm.cfg" hoverEffect={false}>
            <div className="mb-3">
              <FieldLabel>Message type</FieldLabel>
              <div className="flex flex-wrap gap-3">
                {(["notification", "data", "both"] as const).map((m) => (
                  <label key={m} className="flex items-center gap-2 font-mono text-xs cursor-pointer">
                    <input
                      type="radio"
                      checked={mode === m}
                      onChange={() => setMode(m)}
                      className="accent-primary"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel>Title</FieldLabel>
                <div className="cyber-input-wrap">
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="cyber-input w-full text-sm" />
                </div>
              </div>
              <div>
                <FieldLabel>Priority</FieldLabel>
                <div className="cyber-input-wrap">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as "normal" | "high")}
                    className="cyber-input w-full text-sm appearance-none cursor-pointer"
                  >
                    <option value="high">high</option>
                    <option value="normal">normal</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <FieldLabel>Body</FieldLabel>
              <div className="cyber-input-wrap">
                <input value={body} onChange={(e) => setBody(e.target.value)} className="cyber-input w-full text-sm" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel>Device token (optional)</FieldLabel>
                <div className="cyber-input-wrap">
                  <input value={token} onChange={(e) => setToken(e.target.value)} className="cyber-input w-full text-sm" placeholder="FCM token" />
                </div>
              </div>
              <div>
                <FieldLabel>Topic (if no token)</FieldLabel>
                <div className="cyber-input-wrap">
                  <input value={topic} onChange={(e) => setTopic(e.target.value)} className="cyber-input w-full text-sm" />
                </div>
              </div>
              <div>
                <FieldLabel>Sound</FieldLabel>
                <div className="cyber-input-wrap">
                  <input value={sound} onChange={(e) => setSound(e.target.value)} className="cyber-input w-full text-sm" />
                </div>
              </div>
              <div>
                <FieldLabel>Android channel ID</FieldLabel>
                <div className="cyber-input-wrap">
                  <input value={androidChannelId} onChange={(e) => setAndroidChannelId(e.target.value)} className="cyber-input w-full text-sm" />
                </div>
              </div>
              <div>
                <FieldLabel>Click action</FieldLabel>
                <div className="cyber-input-wrap">
                  <input value={clickAction} onChange={(e) => setClickAction(e.target.value)} className="cyber-input w-full text-sm" />
                </div>
              </div>
              <div>
                <FieldLabel>Image URL</FieldLabel>
                <div className="cyber-input-wrap">
                  <input value={image} onChange={(e) => setImage(e.target.value)} className="cyber-input w-full text-sm" />
                </div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <FieldLabel>Data payload</FieldLabel>
                <CyberButton
                  type="button"
                  variant="outline"
                  className="text-xs px-2 py-1"
                  onClick={() => setDataPairs((p) => [...p, { key: "", value: "" }])}
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </CyberButton>
              </div>
              {dataPairs.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <div className="cyber-input-wrap">
                    <input
                      value={row.key}
                      onChange={(e) =>
                        setDataPairs((p) =>
                          p.map((r, idx) => (idx === i ? { ...r, key: e.target.value } : r))
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
                        setDataPairs((p) =>
                          p.map((r, idx) => (idx === i ? { ...r, value: e.target.value } : r))
                        )
                      }
                      className="cyber-input w-full text-sm"
                      placeholder="value"
                    />
                  </div>
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-destructive"
                    onClick={() => setDataPairs((p) => p.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <CopyButton text={json} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="payload.json" hoverEffect={false}>
            <OutputBlock value={json} className="min-h-[360px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </MobileToolShell>
  );
}
