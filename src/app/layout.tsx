import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Keystone | Premium Real Estate Projects Showcase',
  description:
    'Explore luxury residential townships, villa enclaves, modern apartments, and Grade-A commercial towers with Keystone Developments.',
  keywords: [
    'Real Estate Projects',
    'Luxury Villas',
    'Residential Townships',
    'Commercial Office Towers',
    'Keystone Developments',
    'Real Estate Developer',
  ],
  authors: [{ name: 'Keystone Developments' }],
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Keystone | Premium Real Estate Projects',
    description: 'Explore master-planned residential & commercial projects built by Keystone.',
    type: 'website',
    url: 'https://keystonedev.com',
    siteName: 'Keystone Developments',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keystone | Master Real Estate Projects',
    description: 'Browse master-planned residential & commercial developments.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="bg-white text-slate-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
