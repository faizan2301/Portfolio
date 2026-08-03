import { load as loadYaml } from "js-yaml";

export interface YamlValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  jsonPreview: string;
  data: unknown;
}

export function validateYaml(raw: string): YamlValidationResult {
  if (!raw.trim()) {
    return {
      valid: false,
      errors: ["YAML input is empty."],
      warnings: [],
      jsonPreview: "",
      data: null,
    };
  }

  try {
    const data = loadYaml(raw);
    const warnings: string[] = [];
    if (data === null || data === undefined) {
      warnings.push("Document parsed as empty / null.");
    }
    return {
      valid: true,
      errors: [],
      warnings,
      jsonPreview: JSON.stringify(data ?? null, null, 2),
      data,
    };
  } catch (err) {
    return {
      valid: false,
      errors: [err instanceof Error ? err.message : "Invalid YAML"],
      warnings: [],
      jsonPreview: "",
      data: null,
    };
  }
}

export interface ComposeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  services: string[];
  summary: string;
}

export function validateDockerCompose(raw: string): ComposeValidationResult {
  const yaml = validateYaml(raw);
  if (!yaml.valid) {
    return {
      valid: false,
      errors: yaml.errors,
      warnings: [],
      services: [],
      summary: "YAML parse failed.",
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [...yaml.warnings];
  const data = yaml.data;

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      valid: false,
      errors: ["Root must be a mapping / object."],
      warnings,
      services: [],
      summary: "Invalid compose root.",
    };
  }

  const root = data as Record<string, unknown>;
  const version = root.version;
  if (typeof version === "string") {
    warnings.push(
      `version: "${version}" is obsolete in Compose V2 — safe to remove.`
    );
  }

  if (!root.services || typeof root.services !== "object" || Array.isArray(root.services)) {
    errors.push('Missing required "services" mapping.');
  }

  const servicesObj = (root.services as Record<string, unknown>) || {};
  const services = Object.keys(servicesObj);

  if (services.length === 0 && errors.length === 0) {
    warnings.push("No services defined.");
  }

  for (const [name, cfg] of Object.entries(servicesObj)) {
    if (!cfg || typeof cfg !== "object" || Array.isArray(cfg)) {
      errors.push(`Service "${name}" must be a mapping.`);
      continue;
    }
    const service = cfg as Record<string, unknown>;
    if (!service.image && !service.build) {
      errors.push(`Service "${name}" needs either "image" or "build".`);
    }
    if (service.ports && !Array.isArray(service.ports) && typeof service.ports !== "object") {
      warnings.push(`Service "${name}": ports should be a list.`);
    }
    if (service.volumes && !Array.isArray(service.volumes)) {
      warnings.push(`Service "${name}": volumes should typically be a list.`);
    }
    if (service.environment && Array.isArray(service.environment) === false && typeof service.environment !== "object") {
      warnings.push(`Service "${name}": environment should be a map or list.`);
    }
  }

  if (root.networks && (typeof root.networks !== "object" || Array.isArray(root.networks))) {
    errors.push('"networks" must be a mapping.');
  }
  if (root.volumes && (typeof root.volumes !== "object" || Array.isArray(root.volumes))) {
    errors.push('"volumes" must be a mapping.');
  }

  const summary = [
    `Services: ${services.length ? services.join(", ") : "(none)"}`,
    root.networks ? "Has networks" : "No top-level networks",
    root.volumes ? "Has volumes" : "No top-level volumes",
  ].join(" · ");

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    services,
    summary,
  };
}

export const SAMPLE_COMPOSE = `services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./html:/usr/share/nginx/html:ro
  api:
    build: ./api
    environment:
      NODE_ENV: production
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
`;

export const SAMPLE_YAML = `app:
  name: demo
  version: 1.2.3
  features:
    - auth
    - billing
  database:
    host: localhost
    port: 5432
`;
