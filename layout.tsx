import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VersaCraft Solutions',
  description: 'VersaCraft Solutions – Book computer help, AI automation, plant care, and more.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
