import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/motion/MotionProvider";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import BlueprintBackground from "@/components/blueprint/BlueprintBackground";
import Journey from "@/components/journey/Journey";
import { site, siteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  metadataBase: new URL(siteUrl),
  openGraph: { siteName: site.name, type: "website", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#102A56" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp />
          <BlueprintBackground />
          <Journey />
        </MotionProvider>
      </body>
    </html>
  );
}
