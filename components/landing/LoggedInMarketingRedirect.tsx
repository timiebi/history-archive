"use client";

import { APP_HOME, hasAuthSession } from "@/lib/app-home";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RedirectWhenLoggedIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Allow staying on marketing: /?marketing=1
    if (searchParams.get("marketing") === "1") return;
    if (hasAuthSession()) {
      router.replace(APP_HOME);
    }
  }, [router, searchParams]);

  return null;
}

/** Soft-redirect logged-in visitors from `/` to app home (skipped with ?marketing=1). */
export function LoggedInMarketingRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectWhenLoggedIn />
    </Suspense>
  );
}
