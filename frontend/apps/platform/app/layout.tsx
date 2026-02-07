import type { Metadata } from 'next';
import { ThemeRegistry, ppMori, aeonik, jetBrainsMono } from '@core3/ui-components';
import Providers from './providers';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: 'Cosmos Platform',
  description: 'Cosmos platform – Measure risk. Build trust.',
  icons: {
    icon: [
      {
        url: '/images/fav-icon-16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/images/fav-icon-32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: {
      url: '/images/fav-icon-32.png',
      sizes: '32x32',
      type: 'image/png',
    },
  },
};

const styles = {
  layout: {
    backgroundColor: '#000000',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={styles.layout}
      className={`${ppMori.variable} ${aeonik.variable} ${jetBrainsMono.variable}`}
    >
      {/* Google Tag Manager */}
      <GoogleTagManager 
        gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} 
      />

      {/* Google Analytics */}
      <GoogleAnalytics
        gaId={process.env.NEXT_PUBLIC_G_TAG as string}
      />

      <body>
        <Providers>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </Providers>

      </body>
      
    </html>
  );
}
