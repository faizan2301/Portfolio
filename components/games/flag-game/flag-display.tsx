"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface FlagDisplayProps {
  code: string;
  alt: string;
}

export default function FlagDisplay({ code, alt }: FlagDisplayProps) {
  const reducedMotion = useReducedMotion();
  const [failedCode, setFailedCode] = useState<string | null>(null);
  const failed = failedCode === code;
  const src = `/flags/${code.toLowerCase()}.svg`;

  return (
    <motion.div
      key={code}
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto w-full max-w-md"
    >
      <div className="border border-primary/40 bg-[#eceff1] p-3 sm:p-4 cyber-chamfer-sm">
        {failed ? (
          <div
            role="img"
            aria-label={alt}
            className="flex aspect-[4/3] items-center justify-center bg-background font-mono text-xs text-muted-foreground"
          >
            Flag could not be loaded
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={640}
            height={480}
            unoptimized
            onError={() => setFailedCode(code)}
            className="mx-auto block aspect-[4/3] h-auto w-full object-contain"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </div>
    </motion.div>
  );
}
