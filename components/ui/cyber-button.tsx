import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "default" | "glitch" | "outline" | "secondary";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const variantClass: Record<Variant, string> = {
  default: "cyber-btn-default",
  glitch: "cyber-btn-glitch",
  outline: "cyber-btn-outline",
  secondary: "cyber-btn-secondary",
};

export function CyberButton({
  variant = "default",
  className,
  children,
  ...props
}: ButtonProps | LinkProps) {
  const classes = cn("cyber-btn", variantClass[variant], className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props as LinkProps;
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonProps)}>
      {children}
    </button>
  );
}
