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
  title: 'Shri Shyam Associate | Home Builder & Real Estate in Sector 7 Dwarka, Delhi',
  description:
    'Shri Shyam Associate is a premier Home Builder and Real Estate Consultant in Sector 7, Dwarka, Delhi. Located at Shop No 247, 2nd Floor, Vardhaman City Mall. Call +91 9911956274.',
  keywords: [
    'Home Builder',
    'Luxury Builder Floors',
    'Shri Shyam Associate',
    'Dwarka Sector 7',
    'Vardhaman City Mall',
    '2nd floor',
    'Real Estate Agent Dwarka',
    'Delhi Builder Floors',
    'Property Consultant Delhi',
    'DDA Flats Dwarka',
    'CGHS Society Flats',
  ],
  authors: [{ name: 'Shri Shyam Associate' }],
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Shri Shyam Associate | Home Builder & Real Estate in Sector 7 Dwarka, Delhi',
    description:
      'Shri Shyam Associate is a premier Home Builder and Real Estate Consultant in Sector 7, Dwarka, Delhi. Located at Shop No 247, 2nd Floor, Vardhaman City Mall.',
    type: 'website',
    url: 'https://keystonerealtyadvisor.com',
    siteName: 'Shri Shyam Associate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shri Shyam Associate | Home Builder & Real Estate in Dwarka',
    description: 'Premier Home Builder & Real Estate Consultant in Sector 7 Dwarka, Delhi.',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['HomeAndConstructionBusiness', 'RealEstateAgent'],
  name: 'Shri Shyam Associate',
  alternateName: ['Shri Shyam associate', 'Shree Shyam Associates', 'Keystone Realty Advisors'],
  image: 'https://keystonerealtyadvisor.com/logo.png',
  telephone: '+919911956274',
  email: 'shrishyamproperties001@gmail.com',
  url: 'https://keystonerealtyadvisor.com',
  priceRange: '₹₹₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No 247, 2nd Floor, Vardhaman City Mall, Vaishali, Sector 7',
    addressLocality: 'Dwarka',
    addressRegion: 'Delhi',
    postalCode: '110077',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 28.5823,
    longitude: 77.07,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="bg-white text-slate-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
}
