import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Navbar />

         <main>{children}</main>
         <Footer />
      </>
   );
}
