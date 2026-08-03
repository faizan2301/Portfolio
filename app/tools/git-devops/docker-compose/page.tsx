import type { Metadata } from "next";
import DockerComposeTool from "@/components/tools/git-devops/docker-compose";

export const metadata: Metadata = {
  title: "Docker Compose Validator | Git & DevOps Tools",
  description: "Validate docker-compose YAML and catch common issues.",
};

export default function Page() {
  return <DockerComposeTool />;
}
