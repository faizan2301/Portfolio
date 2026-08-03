import type { Metadata } from "next";
import BranchNameTool from "@/components/tools/git-devops/branch-name";

export const metadata: Metadata = {
  title: "Git Branch Name Generator | Git & DevOps Tools",
  description: "Create consistent git branch names from type, ticket, and description.",
};

export default function Page() {
  return <BranchNameTool />;
}
