"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LifeBuoy } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="p-4 bg-orange-100/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 flex gap-4 items-center">
        <LifeBuoy className="text-orange-700" size={20} />
        <p className="text-[10px] font-mono text-orange-900 dark:text-orange-200 uppercase tracking-tighter">
          Security_Alert: Identity recovery requested.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Verified_Email</label>
        <Input className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent uppercase text-[10px] font-mono" />
      </div>

      <Button className="w-full h-14 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-none font-black uppercase tracking-[0.2em] text-[10px]">
        Request_Recovery_Key
      </Button>
    </div>
  );
}