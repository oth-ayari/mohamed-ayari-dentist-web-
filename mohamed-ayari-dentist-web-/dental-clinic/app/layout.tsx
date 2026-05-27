import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cabinet-ayari.tn'),
  title: {
    default: 'Cabinet Dentaire Dr Mohamed Ayari — Orthodontie, Hammam Lif',
    template: '%s | Cabinet Dr Ayari',
  },
  description:
    'Cabinet dentaire spécialisé en orthodontie et soins dentaires complets à Hammam Lif, Ben Arous. Dr Mohamed Ben Othman Ayari, chirurgien-dentiste.',
  keywords: [
    'dentiste Hammam Lif',
    'cabinet dentaire Ben Arous',
    'orthodontie Tunisie',
    'Dr Ayari Mohamed',
    'blanchiment dentaire',
    'prothèse dentaire',
    'chirurgie dentaire Hammam Lif',
    'soins dentaires Ben Arous',
  ],
  authors: [{ name: 'Dr Mohamed Ben Othman Ayari' }],
  creator: 'Cabinet Dentaire Dr Ayari',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_TN',
    url: 'https://cabinet-ayari.tn',
    siteName: 'Cabinet Dentaire Dr Ayari',
    title: 'Cabinet Dentaire Dr Mohamed Ayari — Orthodontie, Hammam Lif',
    description: 'Soins dentaires et orthodontie à Hammam Lif, Ben Arous, Tunisie.',
    images: [{ url: '/ayari-dentist.png', alt: 'Cabinet Dentaire Dr Ayari' }],
  },
  alternates: { canonical: 'https://cabinet-ayari.tn' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1B3A5C',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
