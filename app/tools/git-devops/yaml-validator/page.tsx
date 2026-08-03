import type { Metadata } from "next";
import YamlValidatorTool from "@/components/tools/git-devops/yaml-validator";

export const metadata: Metadata = {
  title: "YAML Validator | Git & DevOps Tools",
  description: "Validate YAML syntax and preview normalized JSON.",
};

export default function Page() {
  return <YamlValidatorTool />;
}
