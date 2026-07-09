import { RootChrome } from "@/components/layouts/RootChrome";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/themeProviders";
import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Source_Serif_4 } from "next/font/google";
import "./globals.css";

/** Same stack as Stories: Geist Sans (UI + display), Geist Mono (labels/meta), Source Serif 4 (excerpts / long copy). */
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const siteName = "Gesi";
const description =
  "Gesi — Truth in heritage. An open access, community-verified living record of African history, digital repatriation, community narratives, manuscripts, and timelines.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Truth in African Heritage`,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "Gesi",
    "African history",
    "truth in heritage",
    "Africa",
    "oral history",
    "digital archive",
    "cultural heritage",
    "open access",
    "digital repatriation",
    "African stories",
    "manuscripts",
    "artifacts",
    "timelines",
  ],
  category: "history",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: `${siteName} — African history, open access`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — African history, open access`,
    description,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: [{ url: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${sourceSerif.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            {/* <Navbar /> */}
            <RootChrome />
            <main>{children}</main>
            {/* <Footer/> */}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
