export interface JsonToDartOptions {
  rootName?: string;
  generateToJson?: boolean;
  generateFromJson?: boolean;
  generateCopyWith?: boolean;
  generateToString?: boolean;
  generateEquality?: boolean;
  generateJsonKeys?: boolean;
  alwaysUseNum?: boolean;
  useJsonSerializable?: boolean;
  useEquatable?: boolean;
  useDefaultValue?: boolean;
  generateJsonComment?: boolean;
  makeFieldsFinal?: boolean;
  nullSafety?: boolean;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type DartFieldKind = "primitive" | "object" | "list" | "dynamic";

interface DartField {
  jsonKey: string;
  name: string;
  dartType: string;
  nullable: boolean;
  kind: DartFieldKind;
  listItemType?: string;
  sampleValue: JsonValue;
  nestedClassName?: string;
}

interface DartClass {
  name: string;
  fields: DartField[];
  sampleJson?: JsonObject | JsonValue[];
}

export const DEFAULT_DART_OPTIONS: Required<JsonToDartOptions> = {
  rootName: "Root",
  generateToJson: true,
  generateFromJson: true,
  generateCopyWith: true,
  generateToString: true,
  generateEquality: false,
  generateJsonKeys: false,
  alwaysUseNum: false,
  useJsonSerializable: false,
  useEquatable: false,
  useDefaultValue: false,
  generateJsonComment: false,
  makeFieldsFinal: true,
  nullSafety: true,
};

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

function toCamelCase(input: string): string {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function dartSafeIdentifier(input: string): string {
  const camel = toCamelCase(input);
  const reserved = new Set([
    "class",
    "enum",
    "extends",
    "with",
    "implements",
    "mixin",
    "return",
    "new",
    "var",
    "final",
    "const",
    "static",
    "void",
    "null",
    "true",
    "false",
    "if",
    "else",
    "for",
    "while",
    "switch",
    "case",
    "default",
    "break",
    "continue",
    "this",
    "super",
    "import",
    "export",
    "library",
    "part",
    "typedef",
    "is",
    "as",
    "in",
    "assert",
    "async",
    "await",
    "yield",
    "try",
    "catch",
    "finally",
    "throw",
    "rethrow",
    "factory",
    "get",
    "set",
    "operator",
    "abstract",
    "covariant",
    "deferred",
    "dynamic",
    "external",
    "interface",
    "late",
    "required",
    "typedef",
  ]);

  const safe = /^[A-Za-z_]/.test(camel) ? camel : `field${camel}`;
  return reserved.has(safe) ? `${safe}Value` : safe;
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

function singularize(name: string): string {
  if (name.length > 1 && name.endsWith("ies")) return `${name.slice(0, -3)}y`;
  if (name.length > 1 && name.endsWith("s") && !name.endsWith("ss")) return name.slice(0, -1);
  return name;
}

function defaultValueForType(dartType: string, nullable: boolean, options: Required<JsonToDartOptions>): string {
  if (nullable && !options.useDefaultValue) return "null";
  const base = dartType.replace(/\?$/, "");
  if (base.startsWith("List<")) return "const []";
  if (base === "String") return "''";
  if (base === "bool") return "false";
  if (base === "int") return "0";
  if (base === "double" || base === "num") return "0";
  if (base === "dynamic" || base === "Object") return "null";
  // Nested object — only valid with nullable or when caller handles it
  return "null";
}

function inferNumberType(value: number, alwaysUseNum: boolean): string {
  if (alwaysUseNum) return "num";
  return Number.isInteger(value) ? "int" : "double";
}

function inferPrimitiveType(value: JsonPrimitive, options: Required<JsonToDartOptions>): string {
  if (value === null) return options.nullSafety ? "dynamic" : "dynamic";
  if (typeof value === "string") return "String";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return inferNumberType(value, options.alwaysUseNum);
  return "dynamic";
}

function collectClasses(
  value: JsonValue,
  className: string,
  classes: DartClass[],
  usedNames: Set<string>,
  options: Required<JsonToDartOptions>
): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "dynamic";
    if (value.every(isPlainObject)) {
      return collectMergedObjectClass(value as JsonObject[], className, classes, usedNames, options);
    }
    const firstObj = value.find(isPlainObject);
    if (firstObj) {
      return collectClasses(firstObj, className, classes, usedNames, options);
    }
    return inferPrimitiveType((value.find((v) => v !== null) ?? null) as JsonPrimitive, options);
  }

  if (!isPlainObject(value)) {
    return inferPrimitiveType(value as JsonPrimitive, options);
  }

  const name = uniqueName(className, usedNames);
  const fields: DartField[] = [];

  for (const [jsonKey, fieldValue] of Object.entries(value)) {
    fields.push(buildField(jsonKey, fieldValue, classes, usedNames, options));
  }

  classes.push({ name, fields, sampleJson: value });
  return name;
}

function collectMergedObjectClass(
  objects: JsonObject[],
  className: string,
  classes: DartClass[],
  usedNames: Set<string>,
  options: Required<JsonToDartOptions>
): string {
  const name = uniqueName(className, usedNames);
  const allKeys = new Set<string>();
  objects.forEach((obj) => Object.keys(obj).forEach((k) => allKeys.add(k)));

  const fields: DartField[] = [];
  for (const jsonKey of allKeys) {
    const present = objects.filter((o) => jsonKey in o).map((o) => o[jsonKey]);
    const sample = present.find((v) => v !== null) ?? present[0] ?? null;
    const field = buildField(jsonKey, sample, classes, usedNames, options);
    // Mark nullable if key missing in some objects or value is null
    if (present.length < objects.length || present.some((v) => v === null)) {
      field.nullable = options.nullSafety;
    }
    fields.push(field);
  }

  classes.push({ name, fields, sampleJson: objects[0] });
  return name;
}

function buildField(
  jsonKey: string,
  value: JsonValue,
  classes: DartClass[],
  usedNames: Set<string>,
  options: Required<JsonToDartOptions>
): DartField {
  const name = dartSafeIdentifier(jsonKey);
  const nullable = value === null && options.nullSafety;

  if (value === null) {
    return {
      jsonKey,
      name,
      dartType: "dynamic",
      nullable: false,
      kind: "dynamic",
      sampleValue: null,
    };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return {
        jsonKey,
        name,
        dartType: "List<dynamic>",
        nullable,
        kind: "list",
        listItemType: "dynamic",
        sampleValue: value,
      };
    }

    if (value.every(isPlainObject)) {
      const itemClass = collectMergedObjectClass(
        value as JsonObject[],
        singularize(jsonKey),
        classes,
        usedNames,
        options
      );
      return {
        jsonKey,
        name,
        dartType: `List<${itemClass}>`,
        nullable,
        kind: "list",
        listItemType: itemClass,
        nestedClassName: itemClass,
        sampleValue: value,
      };
    }

    const nonNull = value.find((v) => v !== null);
    if (isPlainObject(nonNull)) {
      const itemClass = collectClasses(nonNull, singularize(jsonKey), classes, usedNames, options);
      return {
        jsonKey,
        name,
        dartType: `List<${itemClass}>`,
        nullable,
        kind: "list",
        listItemType: itemClass,
        nestedClassName: itemClass,
        sampleValue: value,
      };
    }

    const itemType = inferPrimitiveType((nonNull ?? null) as JsonPrimitive, options);
    return {
      jsonKey,
      name,
      dartType: `List<${itemType}>`,
      nullable,
      kind: "list",
      listItemType: itemType,
      sampleValue: value,
    };
  }

  if (isPlainObject(value)) {
    const nested = collectClasses(value, jsonKey, classes, usedNames, options);
    return {
      jsonKey,
      name,
      dartType: nested,
      // Nested models become nullable when defaults are enabled (missing → null)
      nullable: nullable || options.useDefaultValue,
      kind: "object",
      nestedClassName: nested,
      sampleValue: value,
    };
  }

  const dartType = inferPrimitiveType(value as JsonPrimitive, options);
  return {
    jsonKey,
    name,
    dartType,
    nullable,
    kind: "primitive",
    sampleValue: value,
  };
}

function typeWithNull(field: DartField, options: Required<JsonToDartOptions>): string {
  if (!options.nullSafety) return field.dartType;
  if (field.nullable) return field.dartType.endsWith("?") ? field.dartType : `${field.dartType}?`;
  return field.dartType;
}

function formatJsonComment(value: JsonValue, indent = ""): string {
  const json = JSON.stringify(value, null, 2);
  return json
    .split("\n")
    .map((line) => `${indent}/// ${line}`)
    .join("\n");
}

function fromJsonExpression(field: DartField, options: Required<JsonToDartOptions>): string {
  const keyRef = options.generateJsonKeys
    ? `${field.name}Key`
    : `'${field.jsonKey.replace(/'/g, "\\'")}'`;
  const access = `json[${keyRef}]`;
  const nullSuffix = options.nullSafety ? "?" : "";

  if (field.kind === "object" && field.nestedClassName) {
    if (options.useDefaultValue) {
      return `${access} != null ? ${field.nestedClassName}.fromJson(${access} as Map<String, dynamic>) : null`;
    }
    return `${field.nestedClassName}.fromJson(${access} as Map<String, dynamic>)`;
  }

  if (field.kind === "list") {
    const item = field.listItemType ?? "dynamic";
    const isObjectList = Boolean(field.nestedClassName);
    if (isObjectList) {
      return `(${access} as List<dynamic>${nullSuffix} ?? [])\n          .map((e) => ${item}.fromJson(e as Map<String, dynamic>))\n          .toList()`;
    }
    if (item === "dynamic") {
      return `(${access} as List<dynamic>${nullSuffix} ?? [])`;
    }
    return `(${access} as List<dynamic>${nullSuffix} ?? []).map((e) => e as ${item}).toList()`;
  }

  const castType = field.dartType;
  if (options.useDefaultValue) {
    const fallback = defaultValueForType(castType, false, options);
    if (fallback === "null" && (field.kind === "object" || castType === "dynamic")) {
      return `${access} as ${castType}?`;
    }
    return `${access} as ${castType}? ?? ${fallback}`;
  }

  return `${access} as ${typeWithNull(field, options)}`;
}

function toJsonExpression(field: DartField, options: Required<JsonToDartOptions>): string {
  if (field.kind === "object" && field.nestedClassName) {
    return options.nullSafety && field.nullable
      ? `${field.name}?.toJson()`
      : `${field.name}.toJson()`;
  }
  if (field.kind === "list" && field.nestedClassName) {
    return `${field.name}${options.nullSafety && field.nullable ? "?" : ""}.map((e) => e.toJson()).toList()`;
  }
  return field.name;
}

function generateManualClass(cls: DartClass, options: Required<JsonToDartOptions>): string {
  const lines: string[] = [];
  const extendsEquatable = options.useEquatable;
  const classHeader = extendsEquatable
    ? `class ${cls.name} extends Equatable`
    : `class ${cls.name}`;

  if (options.generateJsonComment && cls.sampleJson) {
    lines.push(formatJsonComment(cls.sampleJson));
  }

  lines.push(`${classHeader} {`);

  if (options.generateJsonKeys) {
    for (const field of cls.fields) {
      lines.push(`  static const String ${field.name}Key = '${field.jsonKey}';`);
    }
    if (cls.fields.length) lines.push("");
  }

  const finalKw = options.makeFieldsFinal ? "final " : "";
  for (const field of cls.fields) {
    lines.push(`  ${finalKw}${typeWithNull(field, options)} ${field.name};`);
  }

  lines.push("");

  // Constructor
  if (cls.fields.length === 0) {
    lines.push(`  ${cls.name}();`);
  } else {
    lines.push(`  ${cls.name}({`);
    for (const field of cls.fields) {
      const type = typeWithNull(field, options);
      if (options.useDefaultValue) {
        const fallback = defaultValueForType(field.dartType, field.nullable, options);
        if (fallback === "null" && (field.kind === "object" || field.dartType === "dynamic")) {
          lines.push(`    this.${field.name},`);
        } else if (field.kind === "object") {
          lines.push(`    this.${field.name},`);
        } else {
          lines.push(`    this.${field.name} = ${fallback},`);
        }
      } else if (options.nullSafety && (field.nullable || type.endsWith("?"))) {
        lines.push(`    this.${field.name},`);
      } else if (options.nullSafety) {
        lines.push(`    required this.${field.name},`);
      } else {
        lines.push(`    this.${field.name},`);
      }
    }
    lines.push(`  });`);
  }

  // fromJson
  if (options.generateFromJson && !options.useJsonSerializable) {
    lines.push("");
    lines.push(`  factory ${cls.name}.fromJson(Map<String, dynamic> json) {`);
    lines.push(`    return ${cls.name}(`);
    for (const field of cls.fields) {
      lines.push(`      ${field.name}: ${fromJsonExpression(field, options)},`);
    }
    lines.push(`    );`);
    lines.push(`  }`);
  }

  // toJson
  if (options.generateToJson && !options.useJsonSerializable) {
    lines.push("");
    lines.push(`  Map<String, dynamic> toJson() {`);
    lines.push(`    return {`);
    for (const field of cls.fields) {
      const key = options.generateJsonKeys ? `${field.name}Key` : `'${field.jsonKey}'`;
      lines.push(`      ${key}: ${toJsonExpression(field, options)},`);
    }
    lines.push(`    };`);
    lines.push(`  }`);
  }

  // JsonSerializable stubs
  if (options.useJsonSerializable) {
    if (options.generateFromJson) {
      lines.push("");
      lines.push(`  factory ${cls.name}.fromJson(Map<String, dynamic> json) =>`);
      lines.push(`      _$${cls.name}FromJson(json);`);
    }
    if (options.generateToJson) {
      lines.push("");
      lines.push(`  Map<String, dynamic> toJson() => _$${cls.name}ToJson(this);`);
    }
  }

  // copyWith
  if (options.generateCopyWith) {
    lines.push("");
    lines.push(`  ${cls.name} copyWith({`);
    for (const field of cls.fields) {
      const base = field.dartType.replace(/\?$/, "");
      lines.push(`    ${base}? ${field.name},`);
    }
    lines.push(`  }) {`);
    lines.push(`    return ${cls.name}(`);
    for (const field of cls.fields) {
      lines.push(`      ${field.name}: ${field.name} ?? this.${field.name},`);
    }
    lines.push(`    );`);
    lines.push(`  }`);
  }

  // toString
  if (options.generateToString) {
    lines.push("");
    lines.push(`  @override`);
    const parts = cls.fields.map((f) => `${f.name}: $${f.name}`);
    lines.push(`  String toString() => '${cls.name}(${parts.join(", ")})';`);
  }

  // Equality (manual, when not using Equatable)
  if (options.generateEquality && !options.useEquatable) {
    lines.push("");
    lines.push(`  @override`);
    lines.push(`  bool operator ==(Object other) {`);
    lines.push(`    if (identical(this, other)) return true;`);
    lines.push(`    return other is ${cls.name}`);
    for (const field of cls.fields) {
      lines.push(`        && other.${field.name} == ${field.name}`);
    }
    lines.push(`    ;`);
    lines.push(`  }`);
    lines.push("");
    lines.push(`  @override`);
    lines.push(`  int get hashCode =>`);
    if (cls.fields.length === 0) {
      lines.push(`      runtimeType.hashCode;`);
    } else {
      lines.push(
        `      ${cls.fields.map((f) => `${f.name}.hashCode`).join(" ^ ")};`
      );
    }
  }

  // Equatable props
  if (extendsEquatable) {
    lines.push("");
    lines.push(`  @override`);
    lines.push(`  List<Object?> get props => [`);
    for (const field of cls.fields) {
      lines.push(`        ${field.name},`);
    }
    lines.push(`      ];`);
  }

  lines.push(`}`);
  return lines.join("\n");
}

function generateSerializableClass(cls: DartClass, options: Required<JsonToDartOptions>): string {
  // Same as manual but with annotations — reuse generateManualClass which branches on useJsonSerializable
  const lines: string[] = [];
  if (options.generateJsonComment && cls.sampleJson) {
    lines.push(formatJsonComment(cls.sampleJson));
  }
  lines.push("@JsonSerializable()");
  // Strip comment from manual generator by temporarily disabling comment then prepending annotation
  const withoutComment = generateManualClass(
    { ...cls, sampleJson: undefined },
    { ...options, generateJsonComment: false }
  );
  return `${lines.join("\n")}\n${withoutComment}`;
}

function buildImports(options: Required<JsonToDartOptions>, fileName: string): string {
  const imports: string[] = [];
  if (options.useJsonSerializable) {
    imports.push("import 'package:json_annotation/json_annotation.dart';");
  }
  if (options.useEquatable) {
    imports.push("import 'package:equatable/equatable.dart';");
  }
  if (options.useJsonSerializable) {
    imports.push("");
    imports.push(`part '${fileName}.g.dart';`);
  }
  return imports.length ? `${imports.join("\n")}\n\n` : "";
}

export function jsonToDart(
  jsonInput: string,
  options: JsonToDartOptions = {}
): { code: string; error?: string } {
  const resolved: Required<JsonToDartOptions> = {
    ...DEFAULT_DART_OPTIONS,
    ...options,
    rootName: options.rootName?.trim() || DEFAULT_DART_OPTIONS.rootName,
  };

  // Equatable implies equality via props; avoid duplicate manual equality
  if (resolved.useEquatable) {
    resolved.generateEquality = false;
  }

  let parsed: JsonValue;
  try {
    parsed = JSON.parse(jsonInput) as JsonValue;
  } catch (err) {
    return {
      code: "",
      error: err instanceof Error ? err.message : "Invalid JSON",
    };
  }

  const classes: DartClass[] = [];
  const usedNames = new Set<string>();
  const rootName = toPascalCase(resolved.rootName);

  if (parsed === null || typeof parsed !== "object") {
    return {
      code: "",
      error: "Root JSON value must be an object or an array of objects.",
    };
  }

  if (Array.isArray(parsed)) {
    if (parsed.length === 0 || !parsed.every(isPlainObject)) {
      // Try: if array of objects partially
      if (parsed.some(isPlainObject)) {
        collectMergedObjectClass(
          parsed.filter(isPlainObject) as JsonObject[],
          rootName,
          classes,
          usedNames,
          resolved
        );
      } else {
        return {
          code: "",
          error: "Root array must contain objects to generate Dart classes.",
        };
      }
    } else {
      collectMergedObjectClass(parsed as JsonObject[], rootName, classes, usedNames, resolved);
    }
  } else {
    collectClasses(parsed, rootName, classes, usedNames, resolved);
  }

  const fileName = rootName.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  const imports = buildImports(resolved, fileName);

  const classCode = classes
    .map((cls) =>
      resolved.useJsonSerializable
        ? generateSerializableClass(cls, resolved)
        : generateManualClass(cls, resolved)
    )
    .join("\n\n");

  return { code: `${imports}${classCode}`.trim() };
}

export { SAMPLE_JSON } from "./json-to-typescript";
