import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import { AppShell } from "@/components/shells/app-shell"
import { LocaleProvider } from "@/i18n/locale-context"
import "@/styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "MintBit | 薄荷比特",
  description:
    "MintBit is a mobile-first personalized nutrition journey with assessment, plan, check-in, and community support.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MintBit",
  },
}

export const viewport: Viewport = {
  themeColor: "#6DB578",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased ${inter.className}`}>
        <LocaleProvider>
          <AppShell>{children}</AppShell>
          <Analytics />
        </LocaleProvider>
      </body>
    </html>
  )
}
