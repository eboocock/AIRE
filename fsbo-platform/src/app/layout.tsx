import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIRE FSBO - Sell Your Home Without a Realtor in Washington',
  description: 'Complete FSBO platform for Washington State homeowners. List, manage offers, and close your sale with professional tools and legal documents.',
  keywords: 'FSBO, for sale by owner, Washington real estate, sell home, no realtor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
