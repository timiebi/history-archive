import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { MainWithPadding } from "@/components/layouts/mainWithPadding";

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Navbar />
         <MainWithPadding>{children}</MainWithPadding>
         <Footer />
      </>
   );
}
