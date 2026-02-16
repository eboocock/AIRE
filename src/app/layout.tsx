import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIREA | AI-Powered FSBO Platform - Sell Your Home, Keep Your Equity',
  description:
    'AIREA helps homeowners sell FSBO with AI-powered tools. Get instant property valuations, AI listing descriptions, showing scheduling, and offer management — starting at $299.',
  keywords: [
    'FSBO',
    'for sale by owner',
    'sell home without agent',
    'AI real estate tools',
    'home valuation',
    'flat fee listing',
    'AIREA',
    'sell my home',
    'FSBO Washington',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://airea.ai'),
  openGraph: {
    title: 'AIREA | Sell Your Home Smarter with AI',
    description: 'AI-powered FSBO tools that help you sell your home and keep your equity. Starting at $299.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AIREA',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIREA | AI-Powered FSBO Platform',
    description: 'Sell your home yourself, smarter. AI valuations, listings, and offer management.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
