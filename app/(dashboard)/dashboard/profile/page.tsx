"use client";

import { useMe, useUpdateMe, useChangePassword } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { AUTH_USER_KEY } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User, Lock } from "lucide-react";

export default function DashboardProfilePage() {
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: me, isPending, isError } = useMe({ enabled: true });
  const updateMe = useUpdateMe({
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        const u = localStorage.getItem(AUTH_USER_KEY);
        if (u) {
          try {
            const parsed = JSON.parse(u);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ ...parsed, name: data.name }));
          } catch {
            // ignore
          }
        }
      }
    },
  });
  const changePassword = useChangePassword({
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
  });

  useEffect(() => {
    if (me?.name) setName(me.name);
  }, [me?.name]);

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed === me?.name) return;
    updateMe.mutate({ name: trimmed });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      changePassword.reset();
      return;
    }
    if (newPassword.length < 8) return;
    changePassword.mutate({ currentPassword, newPassword });
  };

  if (isPending && !me) {
    return (
      <main className="py-8 sm:py-12 px-4 sm:px-6 safe-area-inset">
        <div className="max-w-xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-stone-500">Loading profile…</p>
        </div>
      </main>
    );
  }

  if (isError || !me) {
    return (
      <main className="py-8 sm:py-12 px-4 sm:px-6 safe-area-inset">
        <div className="max-w-xl mx-auto">
          <p className="font-mono text-[10px] uppercase text-red-600 dark:text-red-400 mb-4">Could not load profile.</p>
          <Link href="/dashboard" className="text-orange-700 font-mono text-xs uppercase hover:underline min-h-[44px] inline-flex items-center">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const roleLabel = me.role === "ADMIN" ? "Admin" : me.role === "CONTRIBUTOR" ? "Contributor" : "Reader";

  return (
    <main className="py-8 sm:py-12 px-4 sm:px-6 safe-area-inset">
      <div className="max-w-xl mx-auto">
        <p className="flex items-center gap-2 mb-6 text-orange-700 dark:text-orange-400 font-mono text-[10px] uppercase tracking-[0.3em]">
          <User size={16} aria-hidden /> Profile
        </p>
        <h1 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white mb-8">
          Your profile
        </h1>

        {/* Display name & email (read-only email) */}
        <section className="mb-10" aria-labelledby="profile-info-heading">
          <h2 id="profile-info-heading" className="sr-only">
            Account info
          </h2>
          <dl className="space-y-4 mb-8">
            <div>
              <dt className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Email</dt>
              <dd className="font-mono text-sm text-stone-900 dark:text-white">{me.email}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Role</dt>
              <dd className="font-mono text-sm text-stone-900 dark:text-white">{roleLabel}</dd>
            </div>
          </dl>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <label htmlFor="profile-name" className="block text-[10px] font-black uppercase tracking-widest text-stone-400">
              Display name
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent flex-1 min-h-[44px]"
                placeholder="Your name"
                minLength={1}
                aria-describedby="profile-name-hint"
              />
              <Button
                type="submit"
                disabled={updateMe.isPending || name.trim() === me.name}
                className="rounded-none font-mono text-[10px] uppercase shrink-0 min-h-[44px]"
              >
                {updateMe.isPending ? "Saving…" : "Save"}
              </Button>
            </div>
            <p id="profile-name-hint" className="text-stone-500 text-xs">
              This name is shown on your stories and in the dashboard.
            </p>
            {updateMe.isSuccess && (
              <p className="text-[10px] font-mono uppercase text-green-700 dark:text-green-400" role="status">
                Name updated.
              </p>
            )}
            {updateMe.isError && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">
                {updateMe.error?.message}
              </p>
            )}
          </form>
        </section>

        {/* Change password */}
        <section className="pt-8 border-t border-stone-200 dark:border-stone-800" aria-labelledby="password-heading">
          <h2 id="password-heading" className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-black uppercase tracking-widest text-xs mb-4">
            <Lock size={16} aria-hidden /> Change password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <label htmlFor="current-password" className="block text-[10px] font-black uppercase tracking-widest text-stone-400">
              Current password
            </label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent w-full"
              autoComplete="current-password"
              required
            />
            <label htmlFor="new-password" className="block text-[10px] font-black uppercase tracking-widest text-stone-400">
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent w-full"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <label htmlFor="confirm-password" className="block text-[10px] font-black uppercase tracking-widest text-stone-400">
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent w-full"
              autoComplete="new-password"
              minLength={8}
              required
            />
            <Button
              type="submit"
              disabled={changePassword.isPending || !currentPassword || newPassword.length < 8 || newPassword !== confirmPassword}
              className="rounded-none font-mono text-[10px] uppercase min-h-[44px]"
            >
              {changePassword.isPending ? "Updating…" : "Update password"}
            </Button>
            {changePassword.isSuccess && (
              <p className="text-[10px] font-mono uppercase text-green-700 dark:text-green-400" role="status">
                Password updated.
              </p>
            )}
            {changePassword.isError && (
              <p className="text-[10px] font-mono uppercase text-red-600 dark:text-red-400" role="alert">
                {changePassword.error?.message}
              </p>
            )}
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400">
                Passwords do not match.
              </p>
            )}
          </form>
        </section>

        <div className="mt-10">
          <Link
            href="/dashboard"
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-widest text-stone-500 hover:text-orange-700 min-h-[44px]"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
