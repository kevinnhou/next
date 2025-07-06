import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { generateMetadata, generateStructuredData } from "@/lib/metadata";
import Providers from "~/providers";

export const metadata: Metadata = generateMetadata();

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <head>
        <Script
          dangerouslySetInnerHTML={generateStructuredData()}
          type="application/ld+json"
        />
      </head>

      <body
        className="antialiased"
      >
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
