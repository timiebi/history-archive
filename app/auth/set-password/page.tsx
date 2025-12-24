"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SetPasswordPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">New_Access_Key</h2>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">New_Password</label>
          <Input type="password" className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent font-mono" />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400">Confirm_Access_Key</label>
          <Input type="password" className="rounded-none border-stone-200 dark:border-stone-800 bg-transparent font-mono" />
        </div>
      </div>

      <Button className="w-full h-14 bg-orange-800 text-white rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-orange-700">
        Update_Security_Protocol
      </Button>
    </div>
  );
}