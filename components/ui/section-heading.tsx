import type { ReactNode } from "react";

interface SectionHeadingProps {
  badge: string;
  title: ReactNode;
  subtitle?: string;
}

export default function SectionHeading({ badge, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center mb-10 sm:mb-16">
      <span className="section-badge mb-4 sm:mb-5 inline-block">{badge}</span>
      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-widest mb-3 sm:mb-4 section-heading pb-3 font-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto px-2 sm:px-0 mt-5 tracking-wide leading-relaxed font-mono">
          {"> "}{subtitle}
          <span className="typewriter-cursor inline-block ml-1 align-middle opacity-60" />
        </p>
      )}
    </div>
  );
}
