"use client";


import { Button } from "@/components/ui/button";

export default function OTPPage() {
  return (
    <div className="space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-stone-900 dark:text-white">Verification Required</h2>
        <p className="text-stone-500 font-serif italic text-sm px-10">We have transmitted a 6-digit access key to your registered link.</p>
      </div>

      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <input
            key={i}
            maxLength={1}
            className="w-12 h-16 border-b-2 border-stone-200 dark:border-stone-800 bg-transparent text-center text-2xl font-black focus:border-orange-700 outline-none transition-colors"
          />
        ))}
      </div>

      <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-orange-700">
        Resend_Transmission
      </Button>
    </div>
  );
}