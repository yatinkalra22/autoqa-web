import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'AutoQA - AI Testing Agent',
  description: 'Test your app with plain English. No code. No selectors.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-gray-950 text-gray-100 antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
