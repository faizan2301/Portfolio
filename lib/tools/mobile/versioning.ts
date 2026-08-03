export type VersionStrategy =
  | "semver-packed"
  | "major-minor-patch"
  | "incremental"
  | "date-based"
  | "flutter-style";

export function parseVersionName(versionName: string): {
  major: number;
  minor: number;
  patch: number;
  build: number;
} | null {
  const cleaned = versionName.trim().replace(/^v/i, "");
  const match = cleaned.match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?(?:\+(\d+))?/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2] ?? 0),
    patch: Number(match[3] ?? 0),
    build: Number(match[4] ?? 0),
  };
}

export function calculateVersionCode(
  versionName: string,
  strategy: VersionStrategy,
  incrementalBase = 1
): { versionCode: number; explanation: string } | { error: string } {
  const parsed = parseVersionName(versionName);
  if (!parsed && strategy !== "incremental" && strategy !== "date-based") {
    return { error: "Enter a version like 1.2.3 or 1.2.3+45" };
  }

  const { major = 0, minor = 0, patch = 0, build = 0 } = parsed ?? {};

  switch (strategy) {
    case "semver-packed": {
      // MMM_NNN_PPP — up to 999 each
      const code = major * 1_000_000 + minor * 1_000 + patch;
      return {
        versionCode: code,
        explanation: `${major}*1_000_000 + ${minor}*1_000 + ${patch} = ${code}`,
      };
    }
    case "major-minor-patch": {
      const code = major * 10000 + minor * 100 + patch;
      return {
        versionCode: code,
        explanation: `${major}*10000 + ${minor}*100 + ${patch} = ${code}`,
      };
    }
    case "flutter-style": {
      // Common Flutter: major*100000 + minor*1000 + patch*10 + build%10-ish; use +build
      const code = major * 100000 + minor * 1000 + patch * 10 + (build % 10);
      return {
        versionCode: code,
        explanation: `${major}*100000 + ${minor}*1000 + ${patch}*10 + build = ${code}`,
      };
    }
    case "incremental": {
      return {
        versionCode: incrementalBase,
        explanation: `Manual incremental versionCode = ${incrementalBase}`,
      };
    }
    case "date-based": {
      const now = new Date();
      const y = now.getFullYear() % 100;
      const m = now.getMonth() + 1;
      const d = now.getDate();
      const code = y * 100000000 + m * 1000000 + d * 10000 + (build || incrementalBase);
      return {
        versionCode: code,
        explanation: `YYMMDD + build → ${code}`,
      };
    }
    default:
      return { error: "Unknown strategy" };
  }
}

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: string;
  build: string;
}

export function parseSemVer(input: string): SemVer | null {
  const cleaned = input.trim().replace(/^v/i, "");
  const match = cleaned.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/
  );
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? "",
    build: match[5] ?? "",
  };
}

export function formatSemVer(v: SemVer): string {
  let out = `${v.major}.${v.minor}.${v.patch}`;
  if (v.prerelease) out += `-${v.prerelease}`;
  if (v.build) out += `+${v.build}`;
  return out;
}

export type SemVerBump = "major" | "minor" | "patch" | "prerelease";

export function bumpSemVer(
  current: SemVer,
  bump: SemVerBump,
  prereleaseId = "beta"
): SemVer {
  const next = { ...current, build: "" };
  switch (bump) {
    case "major":
      return { major: next.major + 1, minor: 0, patch: 0, prerelease: "", build: "" };
    case "minor":
      return { major: next.major, minor: next.minor + 1, patch: 0, prerelease: "", build: "" };
    case "patch":
      return { ...next, patch: next.patch + 1, prerelease: "" };
    case "prerelease": {
      if (next.prerelease.startsWith(prereleaseId)) {
        const num = Number(next.prerelease.split(".")[1] || "0");
        return {
          ...next,
          prerelease: `${prereleaseId}.${Number.isFinite(num) ? num + 1 : 1}`,
        };
      }
      return {
        ...next,
        patch: next.prerelease ? next.patch : next.patch + 1,
        prerelease: `${prereleaseId}.1`,
      };
    }
  }
}
