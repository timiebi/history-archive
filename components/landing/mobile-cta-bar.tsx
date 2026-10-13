"use client";

import { useEffect, useState } from "react";
import { landingLinks } from "@/lib/landing-links";

export function MobileCtaBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.55);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`mobile-cta-bar${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
      <a href={landingLinks.explore} className="mobile-cta-bar-text mobile-cta-explore">
        Enter Gesi <span aria-hidden>→</span>
      </a>
      <a href={landingLinks.visit} className="btn btn-platform-primary btn-mobile-cta">
        Explore tours
      </a>
    </div>
  );
}
