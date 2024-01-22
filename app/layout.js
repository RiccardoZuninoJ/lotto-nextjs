import { DM_Sans } from 'next/font/google'
import './globals.css'

const dm_sans = DM_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'RZJ Lotto',
  description: 'A lotto example, built with Next.js and Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={dm_sans.className}>{children}</body>
    </html>
  )
}
