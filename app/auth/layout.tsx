import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0c0a09] flex flex-col lg:flex-row transition-colors duration-500 relative">
      
      {/* BACK TO HOME BUTTON */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 z-100 flex items-center gap-2 group transition-colors"
      >
        <div className="p-2 border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm group-hover:border-orange-700 transition-colors">
          <ChevronLeft size={16} className="text-stone-600 dark:text-stone-400 group-hover:text-orange-700" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
          Back to Home
        </span>
      </Link>

      {/* LEFT SIDE: THE ARTWORK/STORY */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-stone-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
          alt="Ancient geometry"
        />
        <div className="relative z-10 p-20 pt-32 flex flex-col justify-between">
          <div className="space-y-4">
             <span className="text-orange-600 font-black tracking-[0.4em] uppercase text-[10px]">Security_Layer_01</span>
             <h2 className="text-6xl font-black uppercase italic tracking-tighter text-white leading-none">
               Join The <br /> Chronicle.
             </h2>
          </div>
          <p className="text-stone-400 font-serif italic text-lg max-w-sm">
            "History is not merely what happened, but what we preserve."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: THE FORM */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}