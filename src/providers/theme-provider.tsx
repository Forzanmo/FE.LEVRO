'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

/**
 * next-themes is the SINGLE source of truth for light/dark. It writes the
 * `.dark` class on <html> (which Tailwind + shadcn key off of). Mantine and
 * Theme UI are synced from it downstream in AppearanceProvider — no component
 * ever reads or toggles the color scheme through any other mechanism.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
