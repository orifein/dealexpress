import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/site";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.brandHe} — כי בארץ זה סתם יקר`,
    template: `%s · ${site.brandEn}`,
  },
  description: site.descriptionHe,
  icons: {
    icon: [
      { url: "/favicon-red-v2.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico?v=20260902", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon-red-v2.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SiteHeader />
        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
