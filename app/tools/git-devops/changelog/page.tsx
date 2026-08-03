import type { Metadata } from "next";
import ChangelogTool from "@/components/tools/git-devops/changelog";

export const metadata: Metadata = {
  title: "Changelog Generator | Git & DevOps Tools",
  description: "Generate Keep a Changelog style release sections.",
};

export default function Page() {
  return <ChangelogTool />;
}
