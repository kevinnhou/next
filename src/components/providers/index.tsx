"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { QueryProvider } from "./query"
import { ActiveThemeProvider } from "./theme"
import { ToasterProvider } from "./toast"

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        <ActiveThemeProvider>
          <ToasterProvider />
          {children}
        </ActiveThemeProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
