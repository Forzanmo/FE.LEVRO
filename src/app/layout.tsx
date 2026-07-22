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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
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
    <html lang="en" suppressHydrationWarning className={cn(fontVariables, 'h-full')}>
      <body className="bg-background text-foreground flex min-h-full flex-col antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
