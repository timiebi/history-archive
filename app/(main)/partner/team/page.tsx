"use client";

import { PartnerStatusBadge } from "@/components/partner/partner-ui";
import {
  usePartnerAuthGate,
  usePartnerWorkspace,
} from "@/components/partner/use-partner-workspace";
import {
  useAddPartnerMember,
  usePartnerMembers,
  useRemovePartnerMember,
} from "@/lib/api";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function PartnerTeamPage() {
  const { mounted, hasToken, userId } = usePartnerAuthGate();
  const { org, isOwner, canManageTeam, isPending, isError, error } = usePartnerWorkspace(
    mounted && hasToken
  );
  const membersQuery = usePartnerMembers(org?.id ?? null, {
    enabled: mounted && hasToken && !!org?.id,
  });
  const addMut = useAddPartnerMember();
  const removeMut = useRemovePartnerMember();

  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [message, setMessage] = useState("");

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    if (!org || !canManageTeam) return;
    setFormError("");
    setMessage("");
    try {
      await addMut.mutateAsync({ orgId: org.id, email: email.trim() });
      setEmail("");
      setMessage("Manager added.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not add member");
    }
  }

  async function onRemove(membershipId: string, name: string) {
    if (!org || !canManageTeam) return;
    if (!confirm(`Remove ${name} from the team?`)) return;
    setFormError("");
    setMessage("");
    try {
      await removeMut.mutateAsync({ orgId: org.id, membershipId });
      setMessage("Member removed.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not remove member");
    }
  }

  if (!mounted || !hasToken) return null;

  if (isPending) {
    return (
      <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading…</p>
    );
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error?.message}
      </div>
    );
  }

  if (!org) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-stone-600">You do not have a partner organization yet.</p>
        <Link href="/partner" className="text-orange-800 underline text-sm">
          Apply as a tourism partner
        </Link>
      </div>
    );
  }

  const members = membersQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-50">Team</h1>
          <p className="mt-1 text-sm text-stone-500">
            Members who can access this partner workspace. Roles: OWNER and MANAGER only.
          </p>
        </div>
        <PartnerStatusBadge status={org.status} />
      </div>

      {!isOwner && (
        <div className="border border-stone-200 dark:border-stone-800 p-4 text-sm text-stone-600">
          You can view the team. Only the OWNER can add or remove managers.
        </div>
      )}

      {(org.status === "SUSPENDED" || org.status === "REJECTED") && (
        <div className="border border-stone-300 p-4 text-sm text-stone-600">
          Team management is disabled while the organization is{" "}
          {org.status.replace(/_/g, " ").toLowerCase()}.
        </div>
      )}

      {formError && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</div>
      )}
      {message && (
        <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </div>
      )}

      <section className="border border-stone-200 dark:border-stone-800 overflow-hidden">
        {membersQuery.isPending ? (
          <p className="p-5 text-sm text-stone-500">Loading members…</p>
        ) : membersQuery.isError ? (
          <p className="p-5 text-sm text-red-700">{membersQuery.error.message}</p>
        ) : members.length === 0 ? (
          <p className="p-5 text-sm text-stone-500">No members found.</p>
        ) : (
          <ul className="divide-y divide-stone-200 dark:divide-stone-800">
            {members.map((m) => (
              <li
                key={m.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5"
              >
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-50">
                    {m.user.name}
                    {m.user.id === userId ? " (you)" : ""}
                  </p>
                  <p className="text-sm text-stone-500">{m.user.email}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-widest text-stone-500">
                    {m.role}
                  </p>
                </div>
                {canManageTeam && m.role === "MANAGER" && (
                  <button
                    type="button"
                    disabled={removeMut.isPending}
                    onClick={() => onRemove(m.id, m.user.name)}
                    className="inline-flex min-h-[44px] items-center justify-center border border-stone-300 dark:border-stone-700 px-4 text-xs font-mono uppercase tracking-widest text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {canManageTeam && (
        <form
          onSubmit={onAdd}
          className="border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4"
        >
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-50">Add manager</h2>
          <p className="text-sm text-stone-500">
            The person must already have a Gesi account. They will be added as a MANAGER (not OWNER).
          </p>
          <label className="block text-sm">
            <span className="text-stone-600 dark:text-stone-400">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-stone-300 dark:border-stone-700 bg-transparent px-3 py-2.5"
              placeholder="colleague@example.com"
            />
          </label>
          <button
            type="submit"
            disabled={addMut.isPending}
            className="inline-flex min-h-[48px] items-center justify-center bg-stone-900 px-6 text-sm font-semibold uppercase tracking-wider text-white disabled:opacity-50 dark:bg-amber-600"
          >
            {addMut.isPending ? "Adding…" : "Add manager"}
          </button>
        </form>
      )}
    </div>
  );
}
