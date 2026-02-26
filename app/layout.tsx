import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/themeProviders";
import type { Metadata } from "next";
import "./globals.css";
import { SearchOverlay } from "@/components/searchOverlay";


export const metadata: Metadata = {
  title: "African History",
  description: "Preserving African history, culture, and stories",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased ">
        <ThemeProvider>
          <QueryProvider>
            {/* <Navbar /> */}
            <SearchOverlay/>
            <main>{children}</main>
            {/* <Footer/> */}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
