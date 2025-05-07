import "./globals.css"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import Script from "next/script"

import { generateMetadata, generateStructuredData } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import Providers from "~/providers/providers"

export const metadata: Metadata = generateMetadata()

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const activeTheme = cookieStore.get("active_theme")?.value
  return (
    <html dir="ltr" lang="en" suppressHydrationWarning>
      <body
        className={cn("antialiased", activeTheme ? `theme-${activeTheme}` : "")}
      >
        <Providers>
          <Script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={generateStructuredData()}
          />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
