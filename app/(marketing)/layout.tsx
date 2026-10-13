import { JetBrains_Mono, Manrope, Source_Serif_4 } from "next/font/google";
import "@/styles/landing.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500", "700"],
  display: "swap",
});

/** Marketing landing at `/` — own chrome; no app Navbar/Footer. */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`landing-platform ${manrope.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      {children}
    </div>
  );
}
