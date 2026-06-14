import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "default" | "terminal" | "holographic";

interface CyberCardProps {
  variant?: Variant;
  hoverEffect?: boolean;
  className?: string;
  children: ReactNode;
  terminalTitle?: string;
}

export default function CyberCard({
  variant = "default",
  hoverEffect = true,
  className,
  children,
  terminalTitle = "terminal.exe",
}: CyberCardProps) {
  if (variant === "terminal") {
    return (
      <div className={cn("cyber-terminal", hoverEffect && "cyber-card-hover", className)}>
        <div className="cyber-terminal-header">
          <span className="cyber-terminal-dot bg-[#ff3366]" />
          <span className="cyber-terminal-dot bg-[#ffcc00]" />
          <span className="cyber-terminal-dot bg-[#00ff88]" />
          <span className="font-label text-xs text-muted-foreground ml-2 tracking-widest uppercase">
            {terminalTitle}
          </span>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    );
  }

  if (variant === "holographic") {
    return (
      <div className={cn("cyber-card-holo p-4 sm:p-6", hoverEffect && "hover:shadow-[var(--box-shadow-neon)]", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("cyber-card p-4 sm:p-6", hoverEffect && "cyber-card-hover", className)}>
      {children}
    </div>
  );
}
