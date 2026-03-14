import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'AutoQA - AI Testing Agent',
    template: '%s | AutoQA',
  },
  description: 'AI that tests your app like a human. No code. No selectors. Just plain English. Powered by Gemini 2.0 Flash.',
  keywords: ['AI testing', 'QA automation', 'Gemini', 'browser testing', 'no-code testing'],
  openGraph: {
    title: 'AutoQA - AI Testing Agent',
    description: 'Test any web app with plain English. Powered by Gemini Vision.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} font-sans text-gray-900 antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
