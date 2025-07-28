import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { getTikTokPixelScript } from '@/lib/analytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MomentVerse - Where Time Meets Eternity',
  description: 'Dedicate moments in time to eternity. Pair your special moments with real stars from the cosmos and receive beautiful certificates.',
  keywords: 'moment dedication, star pairing, time capsule, cosmic certificates, eternal moments',
  openGraph: {
    title: 'MomentVerse - Where Time Meets Eternity',
    description: 'Dedicate moments in time to eternity. Pair your special moments with real stars from the cosmos.',
    type: 'website',
    url: 'https://momentverse.com',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MomentVerse - Where Time Meets Eternity',
    description: 'Dedicate moments in time to eternity. Pair your special moments with real stars from the cosmos.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* TikTok Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: getTikTokPixelScript()
          }}
        />
        
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID');
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 