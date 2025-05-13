import { ThemeProvider } from "next-themes"
import { cookies } from "next/headers"
import type { ReactNode } from "react"

import { ActiveThemeProvider } from "./theme"
import { ToasterProvider } from "./toast"

export default async function Providers({ children }: { children: ReactNode }) {
  const cookieStore = await cookies()
  const activeTheme = cookieStore.get("active_theme")?.value

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      <ActiveThemeProvider initialTheme={activeTheme}>
        <ToasterProvider />
        {children}
      </ActiveThemeProvider>
    </ThemeProvider>
  )
}
