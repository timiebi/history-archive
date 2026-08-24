"use client";

import { useMyPartnerOrganizations } from "@/lib/api";
import type { PartnerOrganization } from "@/lib/api";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/constants";
import { useEffect, useMemo, useState } from "react";

export function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

export function usePartnerAuthGate() {
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    setHasToken(!!localStorage.getItem(AUTH_TOKEN_KEY));
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      const u = raw ? (JSON.parse(raw) as { id?: string }) : null;
      setUserId(u?.id ?? null);
    } catch {
      setUserId(null);
    }
  }, []);

  return { mounted, hasToken, userId };
}

export function usePartnerWorkspace(enabled: boolean) {
  const query = useMyPartnerOrganizations({ enabled });
  const membership = query.data?.items?.[0] ?? null;
  const org: PartnerOrganization | null = membership?.organization ?? null;
  const membershipRole = membership?.membershipRole ?? null;
  const isOwner = membershipRole === "OWNER";
  const memberCount = org?.memberships?.length ?? 0;

  const canEditOrg = useMemo(() => {
    if (!org || !isOwner) return false;
    return (
      org.status === "DRAFT_APPLICATION" ||
      org.status === "PENDING_REVIEW" ||
      org.status === "NEEDS_INFO" ||
      org.status === "VERIFIED"
    );
  }, [org, isOwner]);

  const canManageTeam = useMemo(() => {
    if (!org || !isOwner) return false;
    return org.status !== "SUSPENDED" && org.status !== "REJECTED";
  }, [org, isOwner]);

  return {
    ...query,
    org,
    membershipRole,
    isOwner,
    memberCount,
    canEditOrg,
    canManageTeam,
  };
}
