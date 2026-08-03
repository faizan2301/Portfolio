import type { Metadata } from "next";
import ReadmeTool from "@/components/tools/git-devops/readme";

export const metadata: Metadata = {
  title: "README Generator | Git & DevOps Tools",
  description: "Scaffold a polished README with features, install, and usage.",
};

export default function Page() {
  return <ReadmeTool />;
}
