import { load as loadYaml } from "js-yaml";
import { SAMPLE_JSON } from "./json-to-typescript";

export type PojoSourceType = "json" | "json-schema" | "yaml" | "yaml-schema";
export type PojoAnnotationStyle =
  | "jackson2"
  | "gson"
  | "moshi"
  | "jsonb1"
  | "jsonb2"
  | "none";
export type PojoValidation = "javax" | "jakarta" | "none";

export interface JsonToPojoOptions {
  rootName?: string;
  packageName?: string;
  sourceType?: PojoSourceType;
  annotationStyle?: PojoAnnotationStyle;
  validationAnnotations?: PojoValidation;
  generateBuilders?: boolean;
  usePrimitives?: boolean;
  useLongIntegers?: boolean;
  useDoubleNumbers?: boolean;
  useJodaDates?: boolean;
  includeGettersSetters?: boolean;
  includeConstructors?: boolean;
  includeHashCodeEquals?: boolean;
  includeToString?: boolean;
  allowAdditionalProperties?: boolean;
  serializable?: boolean;
  parcelable?: boolean;
  initializeCollections?: boolean;
}

export const DEFAULT_POJO_OPTIONS: Required<JsonToPojoOptions> = {
  rootName: "Root",
  packageName: "com.example",
  sourceType: "json",
  annotationStyle: "jackson2",
  validationAnnotations: "none",
  generateBuilders: false,
  usePrimitives: false,
  useLongIntegers: true,
  useDoubleNumbers: true,
  useJodaDates: false,
  includeGettersSetters: true,
  includeConstructors: true,
  includeHashCodeEquals: true,
  includeToString: true,
  allowAdditionalProperties: false,
  serializable: false,
  parcelable: false,
  initializeCollections: true,
};

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type JavaFieldKind = "primitive" | "object" | "list" | "map" | "date";

interface JavaField {
  jsonKey: string;
  name: string;
  javaType: string;
  boxedType: string;
  kind: JavaFieldKind;
  required: boolean;
  listItemType?: string;
  nestedClassName?: string;
}

interface JavaClass {
  name: string;
  fields: JavaField[];
  additionalProperties: boolean;
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

function toCamelCase(input: string): string {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function javaSafeIdentifier(input: string): string {
  const camel = toCamelCase(input);
  const reserved = new Set([
    "abstract", "assert", "boolean", "break", "byte", "case", "catch", "char",
    "class", "const", "continue", "default", "do", "double", "else", "enum",
    "extends", "final", "finally", "float", "for", "goto", "if", "implements",
    "import", "instanceof", "int", "interface", "long", "native", "new",
    "package", "private", "protected", "public", "return", "short", "static",
    "strictfp", "super", "switch", "synchronized", "this", "throw", "throws",
    "transient", "try", "void", "volatile", "while", "true", "false", "null",
    "var", "record", "yield", "sealed", "permits", "non-sealed",
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}(T|\s|$)/.test(value)) return false;
  const t = Date.parse(value);
  return !Number.isNaN(t);
}

function numberTypes(options: Required<JsonToPojoOptions>): {
  intType: string;
  intBoxed: string;
  floatType: string;
  floatBoxed: string;
} {
  const intType = options.useLongIntegers
    ? options.usePrimitives
      ? "long"
      : "Long"
    : options.usePrimitives
      ? "int"
      : "Integer";
  const intBoxed = options.useLongIntegers ? "Long" : "Integer";
  const floatType = options.useDoubleNumbers
    ? options.usePrimitives
      ? "double"
      : "Double"
    : options.usePrimitives
      ? "float"
      : "Float";
  const floatBoxed = options.useDoubleNumbers ? "Double" : "Float";
  return { intType, intBoxed, floatType, floatBoxed };
}

function dateType(options: Required<JsonToPojoOptions>): { type: string; boxed: string } {
  if (options.useJodaDates) {
    return { type: "DateTime", boxed: "DateTime" };
  }
  return { type: "Date", boxed: "Date" };
}

function inferPrimitive(
  value: JsonPrimitive,
  options: Required<JsonToPojoOptions>
): { javaType: string; boxedType: string; kind: JavaFieldKind } {
  if (value === null) {
    return { javaType: "Object", boxedType: "Object", kind: "primitive" };
  }
  if (typeof value === "boolean") {
    return {
      javaType: options.usePrimitives ? "boolean" : "Boolean",
      boxedType: "Boolean",
      kind: "primitive",
    };
  }
  if (typeof value === "number") {
    const nums = numberTypes(options);
    if (Number.isInteger(value)) {
      return { javaType: nums.intType, boxedType: nums.intBoxed, kind: "primitive" };
    }
    return { javaType: nums.floatType, boxedType: nums.floatBoxed, kind: "primitive" };
  }
  if (typeof value === "string") {
    if (isDateString(value)) {
      const d = dateType(options);
      return { javaType: d.type, boxedType: d.boxed, kind: "date" };
    }
    return { javaType: "String", boxedType: "String", kind: "primitive" };
  }
  return { javaType: "Object", boxedType: "Object", kind: "primitive" };
}

function schemaTypeToJava(
  schema: JsonObject,
  fieldName: string,
  classes: JavaClass[],
  usedNames: Set<string>,
  options: Required<JsonToPojoOptions>,
  required: boolean
): JavaField {
  const type = schema.type;
  const nums = numberTypes(options);

  if (type === "object" || schema.properties) {
    const className = collectFromSchema(schema, fieldName, classes, usedNames, options);
    return {
      jsonKey: fieldName,
      name: javaSafeIdentifier(fieldName),
      javaType: className,
      boxedType: className,
      kind: "object",
      required,
      nestedClassName: className,
    };
  }

  if (type === "array" || schema.items) {
    const items = (schema.items as JsonObject) || {};
    let itemType = "Object";
    if (items.type === "object" || items.properties) {
      itemType = collectFromSchema(items, singularize(fieldName), classes, usedNames, options);
    } else if (items.type === "string") {
      itemType = "String";
    } else if (items.type === "integer") {
      itemType = nums.intBoxed;
    } else if (items.type === "number") {
      itemType = nums.floatBoxed;
    } else if (items.type === "boolean") {
      itemType = "Boolean";
    } else if (Array.isArray(items) === false && isPlainObject(items) && !items.type) {
      itemType = collectFromSchema(items, singularize(fieldName), classes, usedNames, options);
    }
    return {
      jsonKey: fieldName,
      name: javaSafeIdentifier(fieldName),
      javaType: `List<${itemType}>`,
      boxedType: `List<${itemType}>`,
      kind: "list",
      required,
      listItemType: itemType,
      nestedClassName: itemType.match(/^[A-Z]/) ? itemType : undefined,
    };
  }

  if (type === "integer") {
    return {
      jsonKey: fieldName,
      name: javaSafeIdentifier(fieldName),
      javaType: required && options.usePrimitives ? (options.useLongIntegers ? "long" : "int") : nums.intBoxed,
      boxedType: nums.intBoxed,
      kind: "primitive",
      required,
    };
  }

  if (type === "number") {
    return {
      jsonKey: fieldName,
      name: javaSafeIdentifier(fieldName),
      javaType:
        required && options.usePrimitives
          ? options.useDoubleNumbers
            ? "double"
            : "float"
          : nums.floatBoxed,
      boxedType: nums.floatBoxed,
      kind: "primitive",
      required,
    };
  }

  if (type === "boolean") {
    return {
      jsonKey: fieldName,
      name: javaSafeIdentifier(fieldName),
      javaType: required && options.usePrimitives ? "boolean" : "Boolean",
      boxedType: "Boolean",
      kind: "primitive",
      required,
    };
  }

  if (type === "string") {
    const format = schema.format as string | undefined;
    if (format === "date-time" || format === "date") {
      const d = dateType(options);
      return {
        jsonKey: fieldName,
        name: javaSafeIdentifier(fieldName),
        javaType: d.type,
        boxedType: d.boxed,
        kind: "date",
        required,
      };
    }
    return {
      jsonKey: fieldName,
      name: javaSafeIdentifier(fieldName),
      javaType: "String",
      boxedType: "String",
      kind: "primitive",
      required,
    };
  }

  return {
    jsonKey: fieldName,
    name: javaSafeIdentifier(fieldName),
    javaType: "Object",
    boxedType: "Object",
    kind: "primitive",
    required,
  };
}

function collectFromSchema(
  schema: JsonObject,
  className: string,
  classes: JavaClass[],
  usedNames: Set<string>,
  options: Required<JsonToPojoOptions>
): string {
  const name = uniqueName(className, usedNames);
  const properties = (schema.properties as JsonObject) || {};
  const requiredList = Array.isArray(schema.required)
    ? (schema.required as string[])
    : [];
  const requiredSet = new Set(requiredList);

  const fields: JavaField[] = [];
  for (const [key, propSchema] of Object.entries(properties)) {
    if (!isPlainObject(propSchema)) continue;
    fields.push(
      schemaTypeToJava(propSchema, key, classes, usedNames, options, requiredSet.has(key))
    );
  }

  const additional =
    options.allowAdditionalProperties ||
    schema.additionalProperties === true ||
    isPlainObject(schema.additionalProperties);

  classes.push({ name, fields, additionalProperties: additional });
  return name;
}

function buildFieldFromValue(
  jsonKey: string,
  value: JsonValue,
  classes: JavaClass[],
  usedNames: Set<string>,
  options: Required<JsonToPojoOptions>
): JavaField {
  const name = javaSafeIdentifier(jsonKey);

  if (value === null) {
    return {
      jsonKey,
      name,
      javaType: "Object",
      boxedType: "Object",
      kind: "primitive",
      required: false,
    };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return {
        jsonKey,
        name,
        javaType: "List<Object>",
        boxedType: "List<Object>",
        kind: "list",
        required: false,
        listItemType: "Object",
      };
    }

    if (value.every(isPlainObject)) {
      const itemClass = collectMergedObjects(
        value as JsonObject[],
        singularize(jsonKey),
        classes,
        usedNames,
        options
      );
      return {
        jsonKey,
        name,
        javaType: `List<${itemClass}>`,
        boxedType: `List<${itemClass}>`,
        kind: "list",
        required: true,
        listItemType: itemClass,
        nestedClassName: itemClass,
      };
    }

    const sample = value.find((v) => v !== null) ?? null;
    if (isPlainObject(sample)) {
      const itemClass = collectFromJson(sample, singularize(jsonKey), classes, usedNames, options);
      return {
        jsonKey,
        name,
        javaType: `List<${itemClass}>`,
        boxedType: `List<${itemClass}>`,
        kind: "list",
        required: true,
        listItemType: itemClass,
        nestedClassName: itemClass,
      };
    }

    const prim = inferPrimitive(sample as JsonPrimitive, options);
    return {
      jsonKey,
      name,
      javaType: `List<${prim.boxedType}>`,
      boxedType: `List<${prim.boxedType}>`,
      kind: "list",
      required: true,
      listItemType: prim.boxedType,
    };
  }

  if (isPlainObject(value)) {
    const nested = collectFromJson(value, jsonKey, classes, usedNames, options);
    return {
      jsonKey,
      name,
      javaType: nested,
      boxedType: nested,
      kind: "object",
      required: true,
      nestedClassName: nested,
    };
  }

  const prim = inferPrimitive(value as JsonPrimitive, options);
  return {
    jsonKey,
    name,
    javaType: prim.javaType,
    boxedType: prim.boxedType,
    kind: prim.kind,
    required: true,
  };
}

function collectFromJson(
  obj: JsonObject,
  className: string,
  classes: JavaClass[],
  usedNames: Set<string>,
  options: Required<JsonToPojoOptions>
): string {
  const name = uniqueName(className, usedNames);
  const fields = Object.entries(obj).map(([key, value]) =>
    buildFieldFromValue(key, value, classes, usedNames, options)
  );
  classes.push({
    name,
    fields,
    additionalProperties: options.allowAdditionalProperties,
  });
  return name;
}

function collectMergedObjects(
  objects: JsonObject[],
  className: string,
  classes: JavaClass[],
  usedNames: Set<string>,
  options: Required<JsonToPojoOptions>
): string {
  const name = uniqueName(className, usedNames);
  const allKeys = new Set<string>();
  objects.forEach((o) => Object.keys(o).forEach((k) => allKeys.add(k)));

  const fields: JavaField[] = [];
  for (const key of allKeys) {
    const present = objects.filter((o) => key in o).map((o) => o[key]);
    const sample = present.find((v) => v !== null) ?? present[0] ?? null;
    const field = buildFieldFromValue(key, sample, classes, usedNames, options);
    field.required = present.length === objects.length && !present.some((v) => v === null);
    // Prefer boxed types when not always present
    if (!field.required && options.usePrimitives) {
      if (field.javaType === "int") field.javaType = "Integer";
      if (field.javaType === "long") field.javaType = "Long";
      if (field.javaType === "double") field.javaType = "Double";
      if (field.javaType === "float") field.javaType = "Float";
      if (field.javaType === "boolean") field.javaType = "Boolean";
    }
    fields.push(field);
  }

  classes.push({
    name,
    fields,
    additionalProperties: options.allowAdditionalProperties,
  });
  return name;
}

function annotationImports(style: PojoAnnotationStyle): string[] {
  switch (style) {
    case "jackson2":
      return [
        "import com.fasterxml.jackson.annotation.JsonInclude;",
        "import com.fasterxml.jackson.annotation.JsonProperty;",
        "import com.fasterxml.jackson.annotation.JsonPropertyOrder;",
      ];
    case "gson":
      return ["import com.google.gson.annotations.SerializedName;"];
    case "moshi":
      return ["import com.squareup.moshi.Json;"];
    case "jsonb1":
      return ["import javax.json.bind.annotation.JsonbProperty;"];
    case "jsonb2":
      return ["import jakarta.json.bind.annotation.JsonbProperty;"];
    default:
      return [];
  }
}

function propertyAnnotation(style: PojoAnnotationStyle, jsonKey: string): string | null {
  switch (style) {
    case "jackson2":
      return `@JsonProperty("${jsonKey}")`;
    case "gson":
      return `@SerializedName("${jsonKey}")`;
    case "moshi":
      return `@Json(name = "${jsonKey}")`;
    case "jsonb1":
    case "jsonb2":
      return `@JsonbProperty("${jsonKey}")`;
    default:
      return null;
  }
}

function validationImport(v: PojoValidation): string | null {
  if (v === "javax") return "import javax.validation.constraints.*;";
  if (v === "jakarta") return "import jakarta.validation.constraints.*;";
  return null;
}

function validationAnnotationsForField(
  field: JavaField,
  v: PojoValidation
): string[] {
  if (v === "none") return [];
  const anns: string[] = [];
  if (field.required) anns.push("@NotNull");
  if (field.javaType === "String" && field.required) anns.push("@NotEmpty");
  return anns;
}

function collectImports(
  classes: JavaClass[],
  options: Required<JsonToPojoOptions>
): string[] {
  const imports = new Set<string>();

  for (const line of annotationImports(options.annotationStyle)) {
    imports.add(line);
  }

  const valImp = validationImport(options.validationAnnotations);
  if (valImp) imports.add(valImp);

  const needsList = classes.some((c) => c.fields.some((f) => f.kind === "list"));
  const needsMap = classes.some((c) => c.additionalProperties);
  const needsDate = classes.some((c) => c.fields.some((f) => f.kind === "date"));

  if (needsList) {
    imports.add("import java.util.List;");
    if (options.initializeCollections) imports.add("import java.util.ArrayList;");
  }
  if (needsMap) {
    imports.add("import java.util.Map;");
    if (options.initializeCollections) imports.add("import java.util.HashMap;");
  }
  if (needsDate) {
    if (options.useJodaDates) {
      imports.add("import org.joda.time.DateTime;");
    } else {
      imports.add("import java.util.Date;");
    }
  }
  if (options.serializable) {
    imports.add("import java.io.Serializable;");
  }
  if (options.parcelable) {
    imports.add("import android.os.Parcel;");
    imports.add("import android.os.Parcelable;");
  }

  // Jackson include for additional properties often uses JsonAnyGetter - skip for simplicity
  if (options.annotationStyle === "jackson2" && options.allowAdditionalProperties) {
    imports.add("import com.fasterxml.jackson.annotation.JsonIgnoreProperties;");
  }

  return [...imports].sort();
}

function generateClass(cls: JavaClass, options: Required<JsonToPojoOptions>): string {
  const lines: string[] = [];
  const implementsParts: string[] = [];
  if (options.serializable) implementsParts.push("Serializable");
  if (options.parcelable) implementsParts.push("Parcelable");

  if (options.annotationStyle === "jackson2") {
    const order = cls.fields.map((f) => `"${f.jsonKey}"`).join(", ");
    if (order) lines.push(`@JsonPropertyOrder({${order}})`);
    lines.push("@JsonInclude(JsonInclude.Include.NON_NULL)");
    if (cls.additionalProperties || options.allowAdditionalProperties) {
      lines.push('@JsonIgnoreProperties(ignoreUnknown = true)');
    }
  }

  const impl =
    implementsParts.length > 0 ? ` implements ${implementsParts.join(", ")}` : "";
  lines.push(`public class ${cls.name}${impl} {`);
  lines.push("");

  if (options.serializable) {
    lines.push(`    private static final long serialVersionUID = 1L;`);
    lines.push("");
  }

  // Fields
  for (const field of cls.fields) {
    for (const ann of validationAnnotationsForField(field, options.validationAnnotations)) {
      lines.push(`    ${ann}`);
    }
    const propAnn = propertyAnnotation(options.annotationStyle, field.jsonKey);
    if (propAnn) lines.push(`    ${propAnn}`);

    if (field.kind === "list" && options.initializeCollections) {
      lines.push(
        `    private ${field.javaType} ${field.name} = new ArrayList${
          field.listItemType ? `<${field.listItemType}>` : "<>"
        }();`
      );
    } else {
      lines.push(`    private ${field.javaType} ${field.name};`);
    }
    lines.push("");
  }

  if (cls.additionalProperties || options.allowAdditionalProperties) {
    if (options.initializeCollections) {
      lines.push(
        `    private Map<String, Object> additionalProperties = new HashMap<>();`
      );
    } else {
      lines.push(`    private Map<String, Object> additionalProperties;`);
    }
    lines.push("");
  }

  // No-arg constructor
  if (options.includeConstructors) {
    lines.push(`    /**`);
    lines.push(`     * No args constructor for use in serialization`);
    lines.push(`     */`);
    lines.push(`    public ${cls.name}() {`);
    lines.push(`    }`);
    lines.push("");

    if (cls.fields.length > 0) {
      lines.push(`    /**`);
      lines.push(`     * All args constructor`);
      lines.push(`     */`);
      const params = cls.fields
        .map((f) => `${f.javaType} ${f.name}`)
        .join(", ");
      lines.push(`    public ${cls.name}(${params}) {`);
      for (const field of cls.fields) {
        lines.push(`        this.${field.name} = ${field.name};`);
      }
      lines.push(`    }`);
      lines.push("");
    }
  }

  // Getters / setters
  if (options.includeGettersSetters) {
    for (const field of cls.fields) {
      const getterPrefix =
        field.javaType === "boolean" || field.javaType === "Boolean" ? "is" : "get";
      lines.push(`    public ${field.javaType} ${getterPrefix}${capitalize(field.name)}() {`);
      lines.push(`        return ${field.name};`);
      lines.push(`    }`);
      lines.push("");
      lines.push(
        `    public void set${capitalize(field.name)}(${field.javaType} ${field.name}) {`
      );
      lines.push(`        this.${field.name} = ${field.name};`);
      lines.push(`    }`);
      lines.push("");
    }

    if (cls.additionalProperties || options.allowAdditionalProperties) {
      lines.push(`    public Map<String, Object> getAdditionalProperties() {`);
      lines.push(`        return additionalProperties;`);
      lines.push(`    }`);
      lines.push("");
      lines.push(
        `    public void setAdditionalProperties(Map<String, Object> additionalProperties) {`
      );
      lines.push(`        this.additionalProperties = additionalProperties;`);
      lines.push(`    }`);
      lines.push("");
    }
  }

  // Builder
  if (options.generateBuilders) {
    lines.push(`    public static Builder builder() {`);
    lines.push(`        return new Builder();`);
    lines.push(`    }`);
    lines.push("");
    lines.push(`    public static final class Builder {`);
    for (const field of cls.fields) {
      lines.push(`        private ${field.javaType} ${field.name};`);
    }
    lines.push("");
    lines.push(`        private Builder() {`);
    lines.push(`        }`);
    lines.push("");
    for (const field of cls.fields) {
      lines.push(
        `        public Builder ${field.name}(${field.javaType} ${field.name}) {`
      );
      lines.push(`            this.${field.name} = ${field.name};`);
      lines.push(`            return this;`);
      lines.push(`        }`);
      lines.push("");
    }
    lines.push(`        public ${cls.name} build() {`);
    if (cls.fields.length === 0) {
      lines.push(`            return new ${cls.name}();`);
    } else if (options.includeConstructors) {
      lines.push(
        `            return new ${cls.name}(${cls.fields.map((f) => f.name).join(", ")});`
      );
    } else {
      lines.push(`            ${cls.name} result = new ${cls.name}();`);
      for (const field of cls.fields) {
        lines.push(`            result.${field.name} = ${field.name};`);
      }
      lines.push(`            return result;`);
    }
    lines.push(`        }`);
    lines.push(`    }`);
    lines.push("");
  }

  // hashCode / equals
  if (options.includeHashCodeEquals) {
    lines.push(`    @Override`);
    lines.push(`    public int hashCode() {`);
    if (cls.fields.length === 0) {
      lines.push(`        return 1;`);
    } else {
      lines.push(`        int result = 1;`);
      for (const field of cls.fields) {
        const isPrim =
          ["int", "long", "double", "float", "boolean"].includes(field.javaType);
        if (field.javaType === "boolean") {
          lines.push(
            `        result = 31 * result + (${field.name} ? 1 : 0);`
          );
        } else if (field.javaType === "long") {
          lines.push(
            `        result = 31 * result + (int) (${field.name} ^ (${field.name} >>> 32));`
          );
        } else if (field.javaType === "double") {
          lines.push(
            `        long ${field.name}Bits = Double.doubleToLongBits(${field.name});`
          );
          lines.push(
            `        result = 31 * result + (int) (${field.name}Bits ^ (${field.name}Bits >>> 32));`
          );
        } else if (field.javaType === "float") {
          lines.push(
            `        result = 31 * result + Float.floatToIntBits(${field.name});`
          );
        } else if (field.javaType === "int") {
          lines.push(`        result = 31 * result + ${field.name};`);
        } else {
          lines.push(
            `        result = 31 * result + (${field.name} != null ? ${field.name}.hashCode() : 0);`
          );
        }
        void isPrim;
      }
      lines.push(`        return result;`);
    }
    lines.push(`    }`);
    lines.push("");

    lines.push(`    @Override`);
    lines.push(`    public boolean equals(Object other) {`);
    lines.push(`        if (other == this) return true;`);
    lines.push(`        if (!(other instanceof ${cls.name})) return false;`);
    lines.push(`        ${cls.name} rhs = (${cls.name}) other;`);
    if (cls.fields.length === 0) {
      lines.push(`        return true;`);
    } else {
      const comparisons = cls.fields.map((field) => {
        if (["int", "long", "boolean"].includes(field.javaType)) {
          return `${field.name} == rhs.${field.name}`;
        }
        if (field.javaType === "double") {
          return `Double.compare(rhs.${field.name}, ${field.name}) == 0`;
        }
        if (field.javaType === "float") {
          return `Float.compare(rhs.${field.name}, ${field.name}) == 0`;
        }
        return `((${field.name} == rhs.${field.name}) || (${field.name} != null && ${field.name}.equals(rhs.${field.name})))`;
      });
      lines.push(`        return ${comparisons.join("\n            && ")};`);
    }
    lines.push(`    }`);
    lines.push("");
  }

  // toString
  if (options.includeToString) {
    lines.push(`    @Override`);
    lines.push(`    public String toString() {`);
    lines.push(`        StringBuilder sb = new StringBuilder();`);
    lines.push(`        sb.append(${cls.name}.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');`);
    cls.fields.forEach((field, i) => {
      lines.push(
        `        sb.append("${field.name}");`
      );
      lines.push(`        sb.append('=');`);
      lines.push(
        `        sb.append(((this.${field.name} == null) ? "<null>" : this.${field.name}));`
      );
      if (i < cls.fields.length - 1) {
        lines.push(`        sb.append(',');`);
      }
    });
    lines.push(`        sb.append(']');`);
    lines.push(`        return sb.toString();`);
    lines.push(`    }`);
    lines.push("");
  }

  // Parcelable stubs (simplified)
  if (options.parcelable) {
    lines.push(`    protected ${cls.name}(Parcel in) {`);
    for (const field of cls.fields) {
      if (field.javaType === "String") {
        lines.push(`        ${field.name} = in.readString();`);
      } else if (field.javaType === "int") {
        lines.push(`        ${field.name} = in.readInt();`);
      } else if (field.javaType === "long") {
        lines.push(`        ${field.name} = in.readLong();`);
      } else if (field.javaType === "double") {
        lines.push(`        ${field.name} = in.readDouble();`);
      } else if (field.javaType === "float") {
        lines.push(`        ${field.name} = in.readFloat();`);
      } else if (field.javaType === "boolean") {
        lines.push(`        ${field.name} = in.readByte() != 0;`);
      } else {
        lines.push(`        // TODO: read ${field.name} from parcel`);
      }
    }
    lines.push(`    }`);
    lines.push("");
    lines.push(`    public static final Creator<${cls.name}> CREATOR = new Creator<${cls.name}>() {`);
    lines.push(`        @Override`);
    lines.push(`        public ${cls.name} createFromParcel(Parcel in) {`);
    lines.push(`            return new ${cls.name}(in);`);
    lines.push(`        }`);
    lines.push("");
    lines.push(`        @Override`);
    lines.push(`        public ${cls.name}[] newArray(int size) {`);
    lines.push(`            return new ${cls.name}[size];`);
    lines.push(`        }`);
    lines.push(`    };`);
    lines.push("");
    lines.push(`    @Override`);
    lines.push(`    public int describeContents() {`);
    lines.push(`        return 0;`);
    lines.push(`    }`);
    lines.push("");
    lines.push(`    @Override`);
    lines.push(`    public void writeToParcel(Parcel dest, int flags) {`);
    for (const field of cls.fields) {
      if (field.javaType === "String") {
        lines.push(`        dest.writeString(${field.name});`);
      } else if (field.javaType === "int") {
        lines.push(`        dest.writeInt(${field.name});`);
      } else if (field.javaType === "long") {
        lines.push(`        dest.writeLong(${field.name});`);
      } else if (field.javaType === "double") {
        lines.push(`        dest.writeDouble(${field.name});`);
      } else if (field.javaType === "float") {
        lines.push(`        dest.writeFloat(${field.name});`);
      } else if (field.javaType === "boolean") {
        lines.push(`        dest.writeByte((byte) (${field.name} ? 1 : 0));`);
      } else {
        lines.push(`        // TODO: write ${field.name} to parcel`);
      }
    }
    lines.push(`    }`);
    lines.push("");
  }

  lines.push(`}`);
  return lines.join("\n");
}

function parseInput(
  input: string,
  sourceType: PojoSourceType
): { value: JsonValue; error?: string; isSchema: boolean } {
  const isSchema = sourceType === "json-schema" || sourceType === "yaml-schema";
  const isYaml = sourceType === "yaml" || sourceType === "yaml-schema";

  try {
    if (isYaml) {
      const value = loadYaml(input) as JsonValue;
      if (value === undefined) {
        return { value: null, error: "Empty YAML document.", isSchema };
      }
      return { value, isSchema };
    }
    return { value: JSON.parse(input) as JsonValue, isSchema };
  } catch (err) {
    return {
      value: null,
      error: err instanceof Error ? err.message : "Failed to parse input",
      isSchema,
    };
  }
}

export function jsonToPojo(
  input: string,
  options: JsonToPojoOptions = {}
): { code: string; error?: string } {
  const resolved: Required<JsonToPojoOptions> = {
    ...DEFAULT_POJO_OPTIONS,
    ...options,
    rootName: options.rootName?.trim() || DEFAULT_POJO_OPTIONS.rootName,
    packageName: options.packageName?.trim() || DEFAULT_POJO_OPTIONS.packageName,
  };

  const parsed = parseInput(input, resolved.sourceType);
  if (parsed.error) {
    return { code: "", error: parsed.error };
  }

  const classes: JavaClass[] = [];
  const usedNames = new Set<string>();
  const rootName = toPascalCase(resolved.rootName);
  const value = parsed.value;

  if (value === null || typeof value !== "object") {
    return { code: "", error: "Root value must be an object or array of objects." };
  }

  if (parsed.isSchema) {
    if (!isPlainObject(value)) {
      return { code: "", error: "Schema root must be an object." };
    }
    // If schema wraps with type object / properties at root
    if (value.properties || value.type === "object") {
      collectFromSchema(value, rootName, classes, usedNames, resolved);
    } else if (value.type === "array" && isPlainObject(value.items)) {
      collectFromSchema(value.items as JsonObject, rootName, classes, usedNames, resolved);
    } else {
      // Treat as schema-like object map or fall back to JSON inference
      collectFromSchema(
        { type: "object", properties: value },
        rootName,
        classes,
        usedNames,
        resolved
      );
    }
  } else if (Array.isArray(value)) {
    if (!value.some(isPlainObject)) {
      return { code: "", error: "Root array must contain objects." };
    }
    collectMergedObjects(
      value.filter(isPlainObject) as JsonObject[],
      rootName,
      classes,
      usedNames,
      resolved
    );
  } else {
    collectFromJson(value, rootName, classes, usedNames, resolved);
  }

  const imports = collectImports(classes, resolved);
  const header = [
    `package ${resolved.packageName};`,
    "",
    ...imports,
    imports.length ? "" : null,
  ]
    .filter((l) => l !== null)
    .join("\n");

  // Emit nested classes first (dependencies), root last — classes array is already child-first
  const bodies = classes.map((cls) => generateClass(cls, resolved)).join("\n\n");

  // For multi-class output in one file, only root should be public — make nested package-private
  // Simpler approach used by many tools: one public class per generation dump with all public
  // Java only allows one public top-level class per file. Split with file comments.
  if (classes.length <= 1) {
    return { code: `${header}\n${bodies}`.trim() };
  }

  const files = classes.map((cls, index) => {
    const isRoot = index === classes.length - 1;
    const classCode = generateClass(cls, resolved);
    // Make non-root classes package-private by replacing "public class" once
    const adjusted = isRoot
      ? classCode
      : classCode.replace(/^public class /m, "class ");
    return `// ${cls.name}.java\n${header}\n${adjusted}`.trim();
  });

  return { code: files.join("\n\n// ───\n\n") };
}

export const SAMPLE_POJO_JSON = SAMPLE_JSON;

export const SAMPLE_JSON_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "required": ["id", "name"],
  "properties": {
    "id": { "type": "integer" },
    "name": { "type": "string" },
    "active": { "type": "boolean" },
    "roles": {
      "type": "array",
      "items": { "type": "string" }
    },
    "profile": {
      "type": "object",
      "properties": {
        "email": { "type": "string" },
        "age": { "type": "integer" }
      }
    }
  }
}`;

export const SAMPLE_YAML = `id: 1
name: Ada Lovelace
active: true
roles:
  - admin
  - editor
profile:
  email: ada@example.com
  age: 36
`;
