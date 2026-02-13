import React from 'react';
import { Inter, DM_Serif_Display, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import AnalyticsTracker from '../components/AnalyticsTracker'; // REMOVED
import type { Metadata } from 'next';

// Optimized font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
  adjustFontFallback: true,
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif',
  weight: ['400'],
  preload: true,
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dailyinstruct.com'),
  title: {
    default: 'Daily Instruct - Where Learning Meets Innovation',
    template: '%s | Daily Instruct',
  },
  description:
    'Daily Instruct delivers timely, in-depth coverage of technology, business, markets, and global trends—providing professionals and decision-makers with clear insights, analysis, and informed perspectives.',
  keywords:
    'technology news, business news, market analysis, financial markets, global trends, economic analysis, emerging technologies, digital innovation, corporate strategy, investment insights, global economy, industry analysis, market intelligence',
  authors: [{ name: 'Daily Instruct' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: 'https://dailyinstruct.com',
    title: 'Daily Instruct - Educational Platform',
    description: 'Daily tutorials, how-to guides, and informative articles',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Daily Instruct',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Instruct - Educational Platform',
    description: 'Daily tutorials, how-to guides, and informative articles',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerifDisplay.variable} ${playfairDisplay.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --primary-black: #1a1a1a;
              --primary-white: #ffffff;
              --accent-gold: #d4af37;
            }
            * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: transparent; }
            body {
              font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin:0; padding:0; overflow-x:hidden; color:#1a1a1a; background:#ffffff;
              -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
            }
            .navbar {
              position: fixed; top:0; left:0; right:0; background: rgba(255,255,255,0.95);
              backdrop-filter: blur(20px); border-bottom: 1px solid #e8e8e8; z-index:1000;
            }
            main { padding-top:80px; min-height:100vh; }
            @media (max-width:768px) { main { padding-top:70px; } }
            
            /* Admin-specific overrides - HIDE navbar/footer on admin pages */
            body.admin-page .navbar,
            body.admin-page .footer {
              display: none !important;
            }
            body.admin-page main {
              padding-top: 0 !important;
            }
          `,
          }}
        />

        <meta charSet="utf-8" />
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="preload"
          href={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/_next/static/css/app/layout.css`}
          as="style"
        />

        {/* Google Analytics GA4 Tag */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-H3C9FZF6E1"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-H3C9FZF6E1', { page_path: window.location.pathname });
            `,
          }}
        />
      </head>
      <body>
        {/* NAVBAR IS BACK! */}
        <Navbar />
        <main>{children}</main>
        {/* FOOTER IS BACK! */}
        <Footer />
      </body>
    </html>
  );
}