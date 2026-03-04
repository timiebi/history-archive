import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/themeProviders";
import { SearchOverlay } from "@/components/searchOverlay";
import type { Metadata } from "next";
import "./globals.css";


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
