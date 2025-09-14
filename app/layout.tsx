import '../globals.css'
import type { Metadata } from 'next'
import Header from '../Header'

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
        <Header />
        {children}
      </body>
    </html>
  )
}
