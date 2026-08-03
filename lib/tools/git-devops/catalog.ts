import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  FileCode2,
  GitBranch,
  GitCommit,
  GitMerge,
  ScrollText,
  Tag,
  FileWarning,
} from "lucide-react";

export type GitDevopsToolMeta = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export const GIT_DEVOPS_TOOLS: GitDevopsToolMeta[] = [
  {
    slug: "gitignore",
    name: ".gitignore Generator",
    description: "Build a .gitignore from popular stacks — Node, Next, Flutter, Python, and more.",
    icon: FileCode2,
  },
  {
    slug: "conventional-commit",
    name: "Conventional Commit Generator",
    description: "Compose Conventional Commits with type, scope, breaking changes, and body.",
    icon: GitCommit,
  },
  {
    slug: "changelog",
    name: "Changelog Generator",
    description: "Turn versioned commit notes into a Keep a Changelog style release section.",
    icon: ScrollText,
  },
  {
    slug: "readme",
    name: "README Generator",
    description: "Scaffold a polished README with badges, install steps, and usage sections.",
    icon: BookOpen,
  },
  {
    slug: "branch-name",
    name: "Git Branch Name Generator",
    description: "Create consistent branch names from type, ticket, and short description.",
    icon: GitBranch,
  },
  {
    slug: "git-tag",
    name: "Git Tag Helper",
    description: "Generate SemVer tags and ready-to-run git tag / push commands.",
    icon: Tag,
  },
  {
    slug: "docker-compose",
    name: "Docker Compose Validator",
    description: "Validate docker-compose YAML structure and catch common config issues.",
    icon: GitMerge,
  },
  {
    slug: "yaml-validator",
    name: "YAML Validator",
    description: "Parse and validate YAML, then preview the normalized JSON output.",
    icon: FileWarning,
  },
];
