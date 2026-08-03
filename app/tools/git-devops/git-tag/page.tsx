import type { Metadata } from "next";
import GitTagTool from "@/components/tools/git-devops/git-tag";

export const metadata: Metadata = {
  title: "Git Tag Helper | Git & DevOps Tools",
  description: "Bump SemVer tags and generate git tag commands.",
};

export default function Page() {
  return <GitTagTool />;
}
