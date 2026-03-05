"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken(tokenFromUrl);
  }, [tokenFromUrl]);

  const reset = useResetPassword();
  const canSubmit =
    token.trim().length > 0 &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canSubmit) return;
    reset.mutate({ token: token.trim(), newPassword });
  };

  if (!mounted) {
    return (
      <div className="space-y-8">
        <p className="text-stone-500 font-mono text-sm">Loading…</p>
      </div>
    );
  }

  if (!tokenFromUrl) {
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">Invalid_Link</h2>
        <p className="text-stone-500 font-mono text-sm">
          This reset link is missing a token. Use the link from your email, or{" "}
          <Link href="/auth/forgot-password" className="text-orange-700 underline">request a new one</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">New_Access_Key</h2>

      <form method="post" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6" noValidate>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">New_Password (min 6 characters)</label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent font-mono pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded cursor-pointer"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Confirm_Access_Key</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent font-mono pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded cursor-pointer"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-[10px] text-red-600 dark:text-red-400 font-mono">Passwords do not match.</p>
          )}
        </div>

        {reset.isError && (
          <p className="text-[10px] font-mono text-red-600 dark:text-red-400 uppercase tracking-tighter">
            {reset.error?.message ?? "Reset failed."}
          </p>
        )}
        {reset.isSuccess && (
          <p className="text-[10px] font-mono text-green-700 dark:text-green-400 uppercase tracking-tighter">
            {reset.data?.message ?? "Password updated. You can now log in."}
          </p>
        )}

        <Button
          type="submit"
          disabled={reset.isPending || !canSubmit}
          className="w-full h-14 bg-orange-800 text-white rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-700 cursor-pointer"
        >
          {reset.isPending ? "Updating…" : "Update_Security_Protocol"}
        </Button>
      </form>

      <p className="text-[10px] text-stone-500">
        <Link href="/auth/login" className="hover:text-orange-700 underline">Back to login</Link>
      </p>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={<div className="space-y-8"><p className="text-stone-500 font-mono text-sm">Loading…</p></div>}>
      <SetPasswordForm />
    </Suspense>
  );
}
