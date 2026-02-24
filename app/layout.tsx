import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { defaultSEO } from './seo.config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://techsolutions.dev'),
  title: {
    default: defaultSEO.title,
    template: '%s | Tech Solutions',
  },
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  authors: [{ name: 'Tech Solutions Team' }],
  creator: 'Tech Solutions',
  publisher: 'Tech Solutions',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techsolutions.dev',
    siteName: 'Tech Solutions',
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: [
      {
        url: 'https://techsolutions.dev/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech Solutions',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@techsolutions',
    creator: '@techsolutions',
    title: defaultSEO.title,
    description: defaultSEO.description,
    images: ['https://techsolutions.dev/twitter-image.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    other: {
      'msvalidate.01': ['your-bing-code'],
    },
  },
  
  category: 'technology',
  
  // Alternate languages
  alternates: {
    canonical: 'https://techsolutions.dev',
    languages: {
      'en-US': 'https://techsolutions.dev',
      'ur-PK': 'https://techsolutions.dev/ur',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        
        {/* Schema.org markup for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tech Solutions',
              url: 'https://techsolutions.dev',
              logo: 'https://techsolutions.dev/logo.png',
              sameAs: [
                'https://www.facebook.com/techsolutions',
                'https://www.twitter.com/techsolutions',
                'https://www.linkedin.com/company/techsolutions',
                'https://github.com/techsolutions',
              ],
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Karachi',
                addressRegion: 'Sindh',
                addressCountry: 'PK',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+92-313-0804352',
                contactType: 'customer service',
                email: 'contact@techsolutions.dev',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        
       < Header/>
        {children}
        <Footer/>
        </body>
    </html>
  );
}