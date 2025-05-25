'use client'

import { SessionProvider } from 'next-auth/react'

import '@/app/globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
      <SessionProvider>
        <main className="flex-1 h-screen">
          {children}
        </main>
      </SessionProvider>
      </body>

    </html>
  )
}
