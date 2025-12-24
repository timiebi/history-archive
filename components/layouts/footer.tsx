import { Mail } from "lucide-react"; // or use an SVG

export function Footer() {
  return (
    <footer className="bg-stone-100 dark:bg-[#080707] pt-24 pb-12 border-t border-stone-200 dark:border-stone-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Newsletter */}
          <div className="md:col-span-6 space-y-8">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              African <span className="text-orange-800">Archives</span>
            </h2>
            <p className="max-w-md text-stone-500 font-serif italic text-lg leading-relaxed">
              "The history of Africa is written in the stars, the soil, and the stories passed from elder to child."
            </p>
            <div className="relative max-w-md">
              <input 
                type="email" 
                placeholder="Follow the lineage (Email)" 
                className="w-full bg-transparent border-b-2 border-stone-300 dark:border-stone-800 py-4 outline-none focus:border-orange-800 transition-colors text-sm font-bold uppercase tracking-widest"
              />
              <button className="absolute right-0 bottom-4 text-orange-800 font-black text-xs uppercase tracking-widest hover:text-stone-900 dark:hover:text-white transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Explore</h4>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-orange-800">Kingdoms</a></li>
                <li><a href="#" className="hover:text-orange-800">Cultures</a></li>
                <li><a href="#" className="hover:text-orange-800">Timeline</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Platform</h4>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-orange-800">About</a></li>
                <li><a href="#" className="hover:text-orange-800">Contribute</a></li>
                <li><a href="#" className="hover:text-orange-800">Contact</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Connect</h4>
              <ul className="space-y-2 text-xs font-bold uppercase tracking-widest">
                <li><a href="#" className="hover:text-orange-800">Instagram</a></li>
                <li><a href="#" className="hover:text-orange-800">X (Twitter)</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-stone-200 dark:border-stone-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black text-stone-400 tracking-widest uppercase">
            © 2025 African Archives Project. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black text-stone-400 tracking-widest uppercase">
            <a href="#" className="hover:text-orange-800 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange-800 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}