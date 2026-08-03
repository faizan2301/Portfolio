export type OutputStyle = "interface" | "type";

export interface JsonToTsOptions {
  rootName?: string;
  style?: OutputStyle;
  useOptionalProps?: boolean;
  exportTypes?: boolean;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

interface NamedType {
  name: string;
  body: string;
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toPascalCase(input: string): string {
  const cleaned = input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/);

  if (cleaned.length === 0 || (cleaned.length === 1 && cleaned[0] === "")) {
    return "Root";
  }

  const pascal = cleaned
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return /^[A-Za-z_]/.test(pascal) ? pascal : `T${pascal}`;
}

function uniqueName(base: string, used: Set<string>): string {
  let name = toPascalCase(base);
  if (!used.has(name)) {
    used.add(name);
    return name;
  }

  let i = 2;
  while (used.has(`${name}${i}`)) i += 1;
  const unique = `${name}${i}`;
  used.add(unique);
  return unique;
}

function inferPrimitive(value: JsonPrimitive): string {
  if (value === null) return "null";
  return typeof value;
}

function mergeTypes(types: string[]): string {
  const unique = [...new Set(types.filter(Boolean))];
  if (unique.length === 0) return "unknown";
  if (unique.length === 1) return unique[0];
  return unique.join(" | ");
}

function singularize(name: string): string {
  if (name.length > 1 && name.endsWith("ies")) return `${name.slice(0, -3)}y`;
  if (name.length > 1 && name.endsWith("s") && !name.endsWith("ss")) return name.slice(0, -1);
  return name;
}

function inferArrayType(
  arr: JsonValue[],
  keyHint: string,
  namedTypes: NamedType[],
  usedNames: Set<string>,
  options: Required<JsonToTsOptions>
): string {
  if (arr.length === 0) return "unknown[]";

  // Homogeneous object arrays → one merged interface
  if (arr.every(isPlainObject)) {
    const merged = mergeObjectArray(arr as JsonObject[], singularize(keyHint), namedTypes, usedNames, options);
    return `${merged}[]`;
  }

  const elementTypes = arr.map((item, index) =>
    inferValue(item, `${keyHint}${index === 0 ? "" : index}`, namedTypes, usedNames, options)
  );

  const merged = mergeTypes(elementTypes);
  return merged.includes("|") ? `Array<${merged}>` : `${merged}[]`;
}

function mergeObjectArray(
  objects: JsonObject[],
  keyHint: string,
  namedTypes: NamedType[],
  usedNames: Set<string>,
  options: Required<JsonToTsOptions>
): string {
  const allKeys = new Set<string>();
  objects.forEach((obj) => Object.keys(obj).forEach((k) => allKeys.add(k)));

  const props: string[] = [];
  for (const key of allKeys) {
    const present = objects
      .filter((obj) => key in obj)
      .map((obj) => obj[key]);
    const optional = options.useOptionalProps && present.length < objects.length;

    // Prefer a single representative for nested objects/arrays to avoid duplicate names
    const sampleObjects = present.filter(isPlainObject);
    const sampleArrays = present.filter(Array.isArray) as JsonValue[][];
    let propType: string;

    if (sampleObjects.length === present.length && present.length > 0) {
      propType = mergeObjectArray(sampleObjects, key, namedTypes, usedNames, options);
    } else if (sampleArrays.length === present.length && present.length > 0) {
      propType = inferArrayType(sampleArrays.flat(), key, namedTypes, usedNames, options);
    } else {
      propType = mergeTypes(
        present.map((v) => inferValue(v, key, namedTypes, usedNames, options))
      );
    }

    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `"${key}"`;
    props.push(`  ${safeKey}${optional ? "?" : ""}: ${propType};`);
  }

  const name = uniqueName(keyHint, usedNames);
  const exportPrefix = options.exportTypes ? "export " : "";
  const body =
    options.style === "interface"
      ? `${exportPrefix}interface ${name} {\n${props.join("\n")}\n}`
      : `${exportPrefix}type ${name} = {\n${props.join("\n")}\n};`;

  namedTypes.push({ name, body });
  return name;
}

function inferObject(
  obj: JsonObject,
  keyHint: string,
  namedTypes: NamedType[],
  usedNames: Set<string>,
  options: Required<JsonToTsOptions>
): string {
  const name = uniqueName(keyHint, usedNames);
  const props: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const propType = inferValue(value, key, namedTypes, usedNames, options);
    const safeKey = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : `"${key}"`;
    const optional = options.useOptionalProps && value === null;
    props.push(`  ${safeKey}${optional ? "?" : ""}: ${propType};`);
  }

  const exportPrefix = options.exportTypes ? "export " : "";
  const body =
    options.style === "interface"
      ? `${exportPrefix}interface ${name} {\n${props.join("\n")}\n}`
      : `${exportPrefix}type ${name} = {\n${props.join("\n")}\n};`;

  namedTypes.push({ name, body });
  return name;
}

function inferValue(
  value: JsonValue,
  keyHint: string,
  namedTypes: NamedType[],
  usedNames: Set<string>,
  options: Required<JsonToTsOptions>
): string {
  if (value === null || typeof value !== "object") {
    return inferPrimitive(value as JsonPrimitive);
  }

  if (Array.isArray(value)) {
    return inferArrayType(value, keyHint, namedTypes, usedNames, options);
  }

  return inferObject(value, keyHint, namedTypes, usedNames, options);
}

export function jsonToTypeScript(
  jsonInput: string,
  options: JsonToTsOptions = {}
): { code: string; error?: string } {
  const resolved: Required<JsonToTsOptions> = {
    rootName: options.rootName?.trim() || "Root",
    style: options.style ?? "interface",
    useOptionalProps: options.useOptionalProps ?? false,
    exportTypes: options.exportTypes ?? true,
  };

  let parsed: JsonValue;
  try {
    parsed = JSON.parse(jsonInput) as JsonValue;
  } catch (err) {
    return {
      code: "",
      error: err instanceof Error ? err.message : "Invalid JSON",
    };
  }

  const namedTypes: NamedType[] = [];
  const usedNames = new Set<string>();

  if (parsed === null || typeof parsed !== "object") {
    const exportPrefix = resolved.exportTypes ? "export " : "";
    const primitive = inferPrimitive(parsed as JsonPrimitive);
    const code =
      resolved.style === "interface"
        ? `${exportPrefix}type ${toPascalCase(resolved.rootName)} = ${primitive};`
        : `${exportPrefix}type ${toPascalCase(resolved.rootName)} = ${primitive};`;
    return { code };
  }

  if (Array.isArray(parsed)) {
    const elementType = inferArrayType(
      parsed,
      resolved.rootName,
      namedTypes,
      usedNames,
      resolved
    );
    const exportPrefix = resolved.exportTypes ? "export " : "";
    const rootAlias = `${exportPrefix}type ${toPascalCase(resolved.rootName)}List = ${elementType};`;
    const nested = namedTypes.map((t) => t.body).join("\n\n");
    return { code: [nested, rootAlias].filter(Boolean).join("\n\n") };
  }

  inferObject(parsed, resolved.rootName, namedTypes, usedNames, resolved);
  return { code: namedTypes.map((t) => t.body).join("\n\n") };
}

export const SAMPLE_JSON = `{
  "id": 1,
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "editor"],
  "profile": {
    "email": "ada@example.com",
    "age": 36,
    "address": {
      "city": "London",
      "zip": "SW1A"
    }
  },
  "projects": [
    {
      "title": "Analytical Engine",
      "year": 1843,
      "tags": ["math", "computing"]
    }
  ]
}`;
