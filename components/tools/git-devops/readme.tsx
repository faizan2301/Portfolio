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
import { buildReadme } from "@/lib/tools/git-devops/generators";

export default function ReadmeTool() {
  const [name, setName] = useState("awesome-app");
  const [description, setDescription] = useState(
    "A short description of what this project does."
  );
  const [features, setFeatures] = useState("Fast\nAccessible\nEasy to extend");
  const [install, setInstall] = useState("npm install\nnpm run dev");
  const [usage, setUsage] = useState("npm start");
  const [license, setLicense] = useState("MIT");
  const [author, setAuthor] = useState("");
  const [repoUrl, setRepoUrl] = useState("https://github.com/user/awesome-app");
  const [badges, setBadges] = useState(true);

  const output = useMemo(
    () =>
      buildReadme({
        name,
        description,
        badges,
        install,
        usage,
        features,
        license,
        author,
        repoUrl,
      }),
    [name, description, badges, install, usage, features, license, author, repoUrl]
  );

  return (
    <GitDevopsToolShell
      title={
        <>
          README <span className="neon-text">Generator</span>
        </>
      }
      subtitle="Scaffold a clear README with features, install, usage, license, and optional badges."
    >
      <RevealItem>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CyberCard variant="terminal" terminalTitle="readme.cfg" hoverEffect={false}>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel htmlFor="name">Project name</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="license">License</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="license"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
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
              <FieldLabel htmlFor="features">Features (one per line)</FieldLabel>
              <div className="cyber-input-wrap cyber-textarea-wrap">
                <textarea
                  id="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={3}
                  className="cyber-input cyber-textarea w-full text-sm resize-y"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel htmlFor="install">Install</FieldLabel>
                <div className="cyber-input-wrap cyber-textarea-wrap">
                  <textarea
                    id="install"
                    value={install}
                    onChange={(e) => setInstall(e.target.value)}
                    rows={3}
                    className="cyber-input cyber-textarea w-full text-xs font-mono resize-y"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="usage">Usage</FieldLabel>
                <div className="cyber-input-wrap cyber-textarea-wrap">
                  <textarea
                    id="usage"
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    rows={3}
                    className="cyber-input cyber-textarea w-full text-xs font-mono resize-y"
                  />
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <FieldLabel htmlFor="author">Author</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="repo">Repo URL</FieldLabel>
                <div className="cyber-input-wrap">
                  <input
                    id="repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="cyber-input w-full text-sm"
                  />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 font-mono text-xs cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={badges}
                onChange={(e) => setBadges(e.target.checked)}
                className="accent-primary"
              />
              Include badge
            </label>
            <CopyButton text={output} />
          </CyberCard>
          <CyberCard variant="terminal" terminalTitle="README.md" hoverEffect={false}>
            <OutputBlock value={output} className="min-h-[420px]" />
          </CyberCard>
        </div>
      </RevealItem>
    </GitDevopsToolShell>
  );
}
