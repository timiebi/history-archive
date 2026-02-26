import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Navbar />

         <main className="pt-16 sm:pt-20 min-h-screen">{children}</main>
         <Footer />
      </>
   );
}
