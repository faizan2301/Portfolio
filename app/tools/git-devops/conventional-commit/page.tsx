import type { Metadata } from "next";
import ConventionalCommitTool from "@/components/tools/git-devops/conventional-commit";

export const metadata: Metadata = {
  title: "Conventional Commit Generator | Git & DevOps Tools",
  description: "Compose Conventional Commit messages with type, scope, and breaking changes.",
};

export default function Page() {
  return <ConventionalCommitTool />;
}
