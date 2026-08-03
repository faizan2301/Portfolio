export interface GitignorePreset {
  id: string;
  label: string;
  lines: string[];
}

export const GITIGNORE_PRESETS: GitignorePreset[] = [
  {
    id: "node",
    label: "Node.js",
    lines: [
      "node_modules/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      ".npm",
      ".yarn/",
      "dist/",
      "build/",
      "coverage/",
      ".env",
      ".env.*",
      "!.env.example",
    ],
  },
  {
    id: "next",
    label: "Next.js",
    lines: [
      ".next/",
      "out/",
      "next-env.d.ts",
      ".vercel",
      "*.tsbuildinfo",
    ],
  },
  {
    id: "react",
    label: "React / Vite",
    lines: ["dist/", "dist-ssr/", "*.local", ".vite/"],
  },
  {
    id: "flutter",
    label: "Flutter",
    lines: [
      ".dart_tool/",
      ".flutter-plugins",
      ".flutter-plugins-dependencies",
      ".packages",
      ".pub-cache/",
      ".pub/",
      "build/",
      "*.iml",
      ".idea/",
    ],
  },
  {
    id: "android",
    label: "Android",
    lines: [
      "*.apk",
      "*.aab",
      "*.ap_",
      "*.dex",
      "*.class",
      "bin/",
      "gen/",
      "out/",
      ".gradle/",
      "local.properties",
      "*.keystore",
      "!debug.keystore",
    ],
  },
  {
    id: "ios",
    label: "iOS / Xcode",
    lines: [
      "Pods/",
      "*.xcuserdata",
      "DerivedData/",
      "*.hmap",
      "*.ipa",
      "*.dSYM.zip",
      "*.dSYM",
      "xcuserdata/",
    ],
  },
  {
    id: "python",
    label: "Python",
    lines: [
      "__pycache__/",
      "*.py[cod]",
      "*.egg-info/",
      ".venv/",
      "venv/",
      ".pytest_cache/",
      ".mypy_cache/",
      ".ruff_cache/",
      "dist/",
      "build/",
      ".env",
    ],
  },
  {
    id: "java",
    label: "Java / Maven / Gradle",
    lines: [
      "target/",
      "*.class",
      "*.jar",
      "*.war",
      ".gradle/",
      "build/",
      "out/",
      ".idea/",
      "*.iml",
    ],
  },
  {
    id: "dotnet",
    label: ".NET",
    lines: [
      "bin/",
      "obj/",
      "*.user",
      "*.suo",
      ".vs/",
      "packages/",
      "*.nupkg",
    ],
  },
  {
    id: "go",
    label: "Go",
    lines: ["bin/", "vendor/", "*.exe", "*.test", "coverage.out"],
  },
  {
    id: "docker",
    label: "Docker",
    lines: [".docker/", "docker-compose.override.yml"],
  },
  {
    id: "os",
    label: "OS junk",
    lines: [
      ".DS_Store",
      "Thumbs.db",
      "Desktop.ini",
      "*.swp",
      "*.swo",
      "*~",
    ],
  },
  {
    id: "ide",
    label: "IDE",
    lines: [
      ".idea/",
      ".vscode/",
      "!/.vscode/extensions.json",
      "*.code-workspace",
      ".history/",
    ],
  },
];

export function buildGitignore(presetIds: string[], custom = ""): string {
  const blocks: string[] = ["# Generated .gitignore", ""];
  const seen = new Set<string>();

  for (const id of presetIds) {
    const preset = GITIGNORE_PRESETS.find((p) => p.id === id);
    if (!preset) continue;
    blocks.push(`# ${preset.label}`);
    for (const line of preset.lines) {
      if (seen.has(line)) continue;
      seen.add(line);
      blocks.push(line);
    }
    blocks.push("");
  }

  const customLines = custom
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim());
  if (customLines.length) {
    blocks.push("# Custom");
    for (const line of customLines) {
      if (seen.has(line)) continue;
      seen.add(line);
      blocks.push(line);
    }
    blocks.push("");
  }

  return blocks.join("\n").trimEnd() + "\n";
}

export const COMMIT_TYPES = [
  { id: "feat", label: "feat", description: "A new feature" },
  { id: "fix", label: "fix", description: "A bug fix" },
  { id: "docs", label: "docs", description: "Documentation only" },
  { id: "style", label: "style", description: "Formatting / whitespace" },
  { id: "refactor", label: "refactor", description: "Code change, no feature/fix" },
  { id: "perf", label: "perf", description: "Performance improvement" },
  { id: "test", label: "test", description: "Adding or fixing tests" },
  { id: "build", label: "build", description: "Build system / dependencies" },
  { id: "ci", label: "ci", description: "CI configuration" },
  { id: "chore", label: "chore", description: "Maintenance" },
  { id: "revert", label: "revert", description: "Revert a previous commit" },
] as const;

export interface ConventionalCommitInput {
  type: string;
  scope: string;
  description: string;
  body: string;
  breaking: boolean;
  breakingDescription: string;
  footers: string;
}

export function buildConventionalCommit(input: ConventionalCommitInput): string {
  const scope = input.scope.trim() ? `(${input.scope.trim()})` : "";
  const bang = input.breaking ? "!" : "";
  const desc = input.description.trim() || "description";
  const header = `${input.type}${scope}${bang}: ${desc}`;

  const parts = [header];
  if (input.body.trim()) {
    parts.push("", input.body.trim());
  }
  if (input.breaking && input.breakingDescription.trim()) {
    parts.push("", `BREAKING CHANGE: ${input.breakingDescription.trim()}`);
  }
  if (input.footers.trim()) {
    parts.push("", input.footers.trim());
  }
  return parts.join("\n");
}

export type ChangelogCategory =
  | "Added"
  | "Changed"
  | "Deprecated"
  | "Removed"
  | "Fixed"
  | "Security";

export interface ChangelogEntry {
  category: ChangelogCategory;
  text: string;
}

export function buildChangelogSection(
  version: string,
  date: string,
  entries: ChangelogEntry[]
): string {
  const grouped = new Map<ChangelogCategory, string[]>();
  for (const e of entries) {
    if (!e.text.trim()) continue;
    const list = grouped.get(e.category) ?? [];
    list.push(e.text.trim());
    grouped.set(e.category, list);
  }

  const lines = [`## [${version.trim() || "X.Y.Z"}] - ${date.trim() || "YYYY-MM-DD"}`, ""];
  const order: ChangelogCategory[] = [
    "Added",
    "Changed",
    "Deprecated",
    "Removed",
    "Fixed",
    "Security",
  ];
  for (const cat of order) {
    const items = grouped.get(cat);
    if (!items?.length) continue;
    lines.push(`### ${cat}`, "");
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

export interface ReadmeInput {
  name: string;
  description: string;
  badges: boolean;
  install: string;
  usage: string;
  features: string;
  license: string;
  author: string;
  repoUrl: string;
}

export function buildReadme(input: ReadmeInput): string {
  const name = input.name.trim() || "Project Name";
  const desc = input.description.trim() || "Short project description.";
  const lines: string[] = [`# ${name}`, "", desc, ""];

  if (input.badges && input.repoUrl.trim()) {
    const repo = input.repoUrl.replace(/\/$/, "");
    lines.push(
      `[![License](https://img.shields.io/badge/license-${encodeURIComponent(input.license || "MIT")}-blue.svg)](${repo})`,
      ""
    );
  }

  const features = input.features
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (features.length) {
    lines.push("## Features", "");
    for (const f of features) lines.push(`- ${f}`);
    lines.push("");
  }

  lines.push("## Getting Started", "");
  lines.push("### Prerequisites", "", "- Node.js 18+ (or your runtime)", "");
  lines.push("### Installation", "", "```bash", input.install.trim() || "npm install", "```", "");
  lines.push("## Usage", "", "```bash", input.usage.trim() || "npm start", "```", "");

  if (input.author.trim()) {
    lines.push("## Author", "", input.author.trim(), "");
  }
  lines.push("## License", "", input.license.trim() || "MIT", "");
  return lines.join("\n");
}

export const BRANCH_TYPES = [
  "feature",
  "fix",
  "bugfix",
  "hotfix",
  "chore",
  "docs",
  "refactor",
  "test",
  "release",
] as const;

export function slugifyBranchPart(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function buildBranchName(
  type: string,
  ticket: string,
  description: string
): string {
  const parts = [slugifyBranchPart(type)];
  if (ticket.trim()) parts.push(slugifyBranchPart(ticket));
  if (description.trim()) parts.push(slugifyBranchPart(description));
  return parts.filter(Boolean).join("/");
}

export type TagBump = "major" | "minor" | "patch" | "prerelease";

export function parseTagVersion(tag: string): {
  prefix: string;
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
} | null {
  const match = tag.trim().match(/^(v)?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!match) return null;
  return {
    prefix: match[1] ?? "",
    major: Number(match[2]),
    minor: Number(match[3]),
    patch: Number(match[4]),
    prerelease: match[5] ?? "",
  };
}

export function formatTagVersion(v: {
  prefix: string;
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
}): string {
  let out = `${v.prefix}${v.major}.${v.minor}.${v.patch}`;
  if (v.prerelease) out += `-${v.prerelease}`;
  return out;
}

export function bumpTag(
  current: string,
  bump: TagBump,
  prereleaseId = "rc"
): string | null {
  const parsed = parseTagVersion(current);
  if (!parsed) return null;
  switch (bump) {
    case "major":
      return formatTagVersion({
        ...parsed,
        major: parsed.major + 1,
        minor: 0,
        patch: 0,
        prerelease: "",
      });
    case "minor":
      return formatTagVersion({
        ...parsed,
        minor: parsed.minor + 1,
        patch: 0,
        prerelease: "",
      });
    case "patch":
      return formatTagVersion({
        ...parsed,
        patch: parsed.patch + 1,
        prerelease: "",
      });
    case "prerelease": {
      if (parsed.prerelease.startsWith(prereleaseId)) {
        const n = Number(parsed.prerelease.split(".")[1] || "0");
        return formatTagVersion({
          ...parsed,
          prerelease: `${prereleaseId}.${Number.isFinite(n) ? n + 1 : 1}`,
        });
      }
      return formatTagVersion({
        ...parsed,
        patch: parsed.prerelease ? parsed.patch : parsed.patch + 1,
        prerelease: `${prereleaseId}.1`,
      });
    }
  }
}

export function buildTagCommands(tag: string, message: string, annotated: boolean): string {
  const msg = message.trim() || `Release ${tag}`;
  if (annotated) {
    return [
      `git tag -a ${tag} -m "${msg.replace(/"/g, '\\"')}"`,
      `git push origin ${tag}`,
      `# List tags:`,
      `git tag -l`,
    ].join("\n");
  }
  return [
    `git tag ${tag}`,
    `git push origin ${tag}`,
    `# Delete remote tag if needed:`,
    `git push origin --delete ${tag}`,
  ].join("\n");
}
