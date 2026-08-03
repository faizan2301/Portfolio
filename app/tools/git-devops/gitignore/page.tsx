import type { Metadata } from "next";
import GitignoreTool from "@/components/tools/git-devops/gitignore";

export const metadata: Metadata = {
  title: ".gitignore Generator | Git & DevOps Tools",
  description: "Generate .gitignore files from popular stack presets.",
};

export default function Page() {
  return <GitignoreTool />;
}
