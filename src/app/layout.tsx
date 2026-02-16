import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIREA | AI Real Estate Agent - Sell Your Home Without the 6% Commission',
  description:
    'AIREA is your AI Real Estate Agent that knows your AIREA. List your home, get AI valuations, manage showings, and close deals — all for a flat $499 fee. Save thousands in commissions.',
  keywords: [
    'AI real estate',
    'AI real estate agent',
    'sell home without agent',
    'FSBO',
    'for sale by owner',
    'home valuation',
    'real estate AI',
    'flat fee listing',
    'AIREA',
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://airea.ai'),
  openGraph: {
    title: 'AIREA | Your AI Real Estate Agent',
    description: 'The AI Real Estate Agent that knows your AIREA. Save the 6% commission.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AIREA',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIREA | AI Real Estate Agent',
    description: 'The AI Real Estate Agent that knows your AIREA. Save thousands in commissions.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
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
