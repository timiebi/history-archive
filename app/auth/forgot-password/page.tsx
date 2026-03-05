"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";
import { useForgotPassword } from "@/lib/api";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const forgot = useForgotPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!email.trim()) return;
    forgot.mutate(email.trim());
  };

  return (
    <div className="space-y-8">
      <div className="p-4 bg-orange-100/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 flex gap-4 items-center">
        <LifeBuoy className="text-orange-700 shrink-0" size={20} />
        <p className="text-[10px] font-mono text-orange-900 dark:text-orange-200 uppercase tracking-tighter">
          Security_Alert: Identity recovery requested.
        </p>
      </div>

      <form method="post" onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} className="space-y-6" noValidate>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Verified_Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent uppercase text-[10px] font-mono"
            required
          />
        </div>

        {forgot.isError && (
          <p className="text-[10px] font-mono text-red-600 dark:text-red-400 uppercase tracking-tighter">
            {forgot.error?.message ?? "Request failed."}
          </p>
        )}
        {forgot.isSuccess && (
          <p className="text-[10px] font-mono text-green-700 dark:text-green-400 uppercase tracking-tighter">
            {forgot.data?.message ?? "If that email exists, we sent a reset link."}
          </p>
        )}

        <Button
          type="submit"
          disabled={forgot.isPending || !email.trim()}
          className="w-full h-14 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-none font-black uppercase tracking-[0.2em] text-[10px] cursor-pointer"
        >
          {forgot.isPending ? "Sending…" : "Request_Recovery_Key"}
        </Button>
      </form>

      <p className="text-[10px] text-stone-500">
        <Link href="/auth/login" className="hover:text-orange-700 underline">Back to login</Link>
      </p>
    </div>
  );
}
