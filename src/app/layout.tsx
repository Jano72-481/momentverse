import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import Providers from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'MomentVerse – Dedicate time to eternity',
    template: '%s | MomentVerse'
  },
  description:
    'Own any second in history, pair it with a real star and share a beautiful certificate that lasts forever. Create permanent, verifiable records of your most meaningful moments.',
  keywords: [
    'moment dedication',
    'star pairing',
    'digital certificates',
    'memory preservation',
    'timeline',
    'eternity',
    'meaningful moments',
    'digital legacy'
  ],
  authors: [{ name: 'MomentVerse Team' }],
  creator: 'MomentVerse',
  publisher: 'MomentVerse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'MomentVerse – Dedicate time to eternity',
    description:
      'Own any second in history and pair it with a star of your choice. Create permanent, verifiable records of your most meaningful moments.',
    url: 'https://momentverse.com',
    siteName: 'MomentVerse',
    images: [
      {
        url: '/api/og?title=MomentVerse',
        width: 1200,
        height: 630,
        alt: 'MomentVerse - Dedicate time to eternity',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MomentVerse – Dedicate time to eternity',
    description: 'Own any second in history and pair it with a star of your choice.',
    images: ['/api/og?title=MomentVerse'],
    creator: '@momentverse',
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
  verification: {
    ...(process.env.GOOGLE_VERIFICATION && { google: process.env.GOOGLE_VERIFICATION }),
    ...(process.env.YANDEX_VERIFICATION && { yandex: process.env.YANDEX_VERIFICATION }),
  },
  alternates: {
    canonical: 'https://momentverse.com',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#7F00FF' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0221' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <meta name="theme-color" content="#0d0221" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MomentVerse" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-space-gradient text-white antialiased selection:bg-purple-500/20 selection:text-white">
        <Providers>
          <Header />
          <main id="main-content">
            {children}
          </main>
          <Footer />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '8px',
                fontSize: '14px',
                maxWidth: '400px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: 'white',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
} 