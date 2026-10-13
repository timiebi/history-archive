"use client";

import { APP_HOME, MARKETING_HOME, homeHrefForSession } from "@/lib/app-home";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Gesi logo / brand link: marketing if logged out, app home if logged in. */
export function BrandHomeLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [href, setHref] = useState(MARKETING_HOME);

  useEffect(() => {
    setHref(homeHrefForSession());
  }, [pathname]);

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export { APP_HOME, MARKETING_HOME };
