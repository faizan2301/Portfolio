"use client";

import { useEffect } from "react";

export default function ScrollToSection() {
  useEffect(() => {
    // Handle initial hash on page load
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }

    // Add click event listeners to all hash links
    const handleHashLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.hash && link.hash.startsWith("#")) {
        e.preventDefault();
        const id = link.hash.substring(1);
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Update URL without causing page jump
          if (typeof window !== "undefined") {
            window.history.pushState(null, "", link.hash);
          }
        }
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleHashLinkClick);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("click", handleHashLinkClick);
      }
    };
  }, []);

  return null;
}
