export interface AasaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  apps: string[];
  details: string[];
}

export function validateAasaJson(raw: string): AasaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const details: string[] = [];
  const apps: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    return {
      valid: false,
      errors: [err instanceof Error ? err.message : "Invalid JSON"],
      warnings: [],
      apps: [],
      details: [],
    };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return {
      valid: false,
      errors: ["Root must be a JSON object."],
      warnings: [],
      apps: [],
      details: [],
    };
  }

  const root = parsed as Record<string, unknown>;

  // Modern format: applinks.details
  if (root.applinks && typeof root.applinks === "object") {
    const applinks = root.applinks as Record<string, unknown>;
    details.push("Found applinks key (modern AASA format).");

    if (Array.isArray(applinks.apps) && applinks.apps.length > 0) {
      warnings.push('applinks.apps should typically be an empty array [].');
    }

    if (Array.isArray(applinks.details)) {
      for (const [i, entry] of applinks.details.entries()) {
        if (!entry || typeof entry !== "object") {
          errors.push(`applinks.details[${i}] must be an object.`);
          continue;
        }
        const d = entry as Record<string, unknown>;
        const appID = (d.appID as string) || "";
        if (!appID) {
          // components-based format may use appIDs array
          if (Array.isArray(d.appIDs)) {
            for (const id of d.appIDs) {
              if (typeof id === "string") apps.push(id);
            }
          } else {
            errors.push(`applinks.details[${i}] missing appID / appIDs.`);
          }
        } else {
          apps.push(appID);
          if (!/^[A-Z0-9]+\.[a-zA-Z0-9.]+$/.test(appID)) {
            warnings.push(
              `appID "${appID}" should look like TEAMID.com.example.app`
            );
          }
        }

        if (d.paths && !Array.isArray(d.paths)) {
          errors.push(`applinks.details[${i}].paths must be an array.`);
        }
        if (d.components && !Array.isArray(d.components)) {
          errors.push(`applinks.details[${i}].components must be an array.`);
        }
        if (!d.paths && !d.components) {
          warnings.push(
            `applinks.details[${i}] has neither paths nor components.`
          );
        }
      }
    } else {
      errors.push("applinks.details must be an array.");
    }
  } else if (root.appID || root.paths) {
    details.push("Found legacy single-app AASA format.");
    if (typeof root.appID === "string") apps.push(root.appID);
  } else {
    warnings.push(
      "No applinks key found. File may still include activitycontinuation / webcredentials."
    );
  }

  if (root.webcredentials) details.push("Contains webcredentials.");
  if (root.activitycontinuation) details.push("Contains activitycontinuation.");

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    apps,
    details,
  };
}

export function pathMatches(pattern: string, path: string): boolean {
  if (pattern === "*") return true;
  if (pattern.startsWith("NOT ")) {
    return !pathMatches(pattern.slice(4).trim(), path);
  }
  // Simple glob: * and ?
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".");
  return new RegExp(`^${escaped}$`).test(path);
}

export function matchUrlAgainstAasa(
  url: string,
  rawAasa: string
): { matched: boolean; messages: string[] } {
  const messages: string[] = [];
  let pathname = "/";
  try {
    pathname = new URL(url).pathname || "/";
  } catch {
    return { matched: false, messages: ["Invalid test URL."] };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawAasa) as Record<string, unknown>;
  } catch {
    return { matched: false, messages: ["AASA JSON is invalid."] };
  }

  const applinks = parsed.applinks as Record<string, unknown> | undefined;
  const details = (applinks?.details as Record<string, unknown>[]) || [];

  for (const entry of details) {
    const paths = (entry.paths as string[]) || [];
    for (const p of paths) {
      if (pathMatches(p, pathname)) {
        messages.push(`Matched path pattern: ${p}`);
        return { matched: true, messages };
      }
    }

    const components = (entry.components as { "/": string }[]) || [];
    for (const c of components) {
      const pattern = c["/"];
      if (pattern && pathMatches(pattern, pathname)) {
        messages.push(`Matched component "/": ${pattern}`);
        return { matched: true, messages };
      }
    }
  }

  messages.push(`No path pattern matched "${pathname}".`);
  return { matched: false, messages };
}

export const SAMPLE_AASA = `{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "ABCDE12345.com.example.app",
        "paths": [ "/product/*", "/promo/*", "NOT /admin/*" ]
      }
    ]
  }
}`;
