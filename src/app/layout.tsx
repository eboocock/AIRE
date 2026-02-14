import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIRE | AI Real Estate - Sell Your Home Without the 6% Commission',
  description:
    'AIRE is your AI-powered real estate agent. List your home, get AI valuations, manage showings, and close deals — all for a flat $499 fee. Save thousands in commissions.',
  keywords: [
    'AI real estate',
    'sell home without agent',
    'FSBO',
    'for sale by owner',
    'home valuation',
    'real estate AI',
    'flat fee listing',
  ],
  openGraph: {
    title: 'AIRE | Your AI Real Estate Agent',
    description: 'Sell your home with AI. Save the 6% commission.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AIRE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIRE | AI Real Estate',
    description: 'Your AI-powered real estate agent. Save thousands in commissions.',
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
