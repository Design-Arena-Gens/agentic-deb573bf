import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '1960s Suburban Drive',
  description: 'A cinematic 1960s home-movie style suburban scene',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
