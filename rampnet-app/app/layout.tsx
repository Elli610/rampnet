import type { Metadata } from 'next';
import { startMintWorker } from '@/lib/startMintWorker';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

startMintWorker();

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'RampNet - Omnichain On-Ramping Infrastructure',
  description:
    'Seamless, programmable on/off-ramping protocol for the omnichain era. Move funds between fiat and supported blockchain networks with minimal friction.',
  keywords:
    'crypto, blockchain, on-ramp, off-ramp, omnichain, DeFi, fiat, wise, flare',
  authors: [{ name: 'RampNet Team' }],
  openGraph: {
    title: 'RampNet - Omnichain On-Ramping Infrastructure',
    description:
      'Seamless, programmable on/off-ramping protocol for the omnichain era',
    url: 'https://rampnet.cypherlab.org/',
    siteName: 'RampNet',
    images: [
      {
        url: '/rampnet_logo.png',
        width: 1200,
        height: 630,
        alt: 'RampNet Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RampNet - Omnichain On-Ramping Infrastructure',
    description:
      'Seamless, programmable on/off-ramping protocol for the omnichain era',
    images: ['/rampnet_logo.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#7c3aed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='h-full' suppressHydrationWarning>
      <link
        rel='icon'
        type='image/png'
        href='/favicon-96x96.png'
        sizes='96x96'
      />
      <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
      <link rel='shortcut icon' href='/favicon.ico' />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-touch-icon.png'
      />
      <link rel='manifest' href='/site.webmanifest' />
      <body
        className={`${inter.className} h-full bg-white text-gray-900 antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

