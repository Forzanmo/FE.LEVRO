import type { Metadata, Viewport } from 'next'

import { fontVariables } from '@/config/fonts'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { AppProviders } from '@/providers'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  // Must match the actual `--background` surfaces, not generic white/near-black
  // — otherwise mobile browser chrome sits a visibly different colour against
  // the page on a product whose trust signal is pixel-level polish.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6fbfc' },
    { media: '(prefers-color-scheme: dark)', color: '#081214' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    /*
     * `data-scroll-behavior="smooth"` is required from Next 16.
     *
     * globals.css sets `scroll-behavior: smooth` on <html> so the skip-link
     * glides to the content instead of teleporting. Next used to neutralise that
     * during route transitions; as of 16 it no longer does unless this attribute
     * says so — so without it every navigation animates its scroll to the top,
     * which reads as lag on a product whose whole claim is that it never wastes
     * the user's time. The attribute keeps smooth for in-page anchors and instant
     * for navigation.
     */
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(fontVariables, 'h-full')}
    >
      {/* No `bg-background` here: globals.css forces the body transparent so the
          fixed decorative backdrops show through, and <html> owns the surface
          colour. Setting it here was dead code that read as if it mattered. */}
      <body className="text-foreground flex min-h-full flex-col antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
