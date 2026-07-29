import React from 'react';
import { Inter, DM_Serif_Display, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminCSSInjector from './AdminCSSInjector';
import Analytics from '../components/Analytics';
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
  metadataBase: new URL('https://www.dailyinstruct.com'),
  title: {
    default: 'Daily Instruct - Explainers & Analysis',
    template: '%s | Daily Instruct',
  },
  description:
    'Daily Instruct provides durable explainers and in-depth analysis across tech, business, markets, and global affairs—delivering the essential context professionals need to understand why things happen and what they mean.',
  authors: [{ name: 'Daily Instruct' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: 'https://www.dailyinstruct.com',
    title: 'Daily Instruct - Explainers & Analysis',
    description: 'Daily Instruct provides durable explainers and in-depth analysis across tech, business, markets, and global affairs—delivering the essential context professionals need to understand why things happen and what they mean.',
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
    title: 'Daily Instruct - Explainers & Analysis',
    description: 'Daily Instruct provides durable explainers and in-depth analysis across tech, business, markets, and global affairs—delivering the essential context professionals need to understand why things happen and what they mean.',
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
        <meta charSet="utf-8" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --primary-black: #1a1a1a;
              --primary-white: #ffffff;
              --accent-gold: #d4af37;
            }
            * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color: transparent; }
            html, body {
              width: 100%;
              max-width: 100vw;
              overflow-x: hidden;
            }
            body {
              font-family: var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin:0; padding:0; color:#1a1a1a; background:#ffffff;
              -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
            }
            .navbar {
              position: fixed; top:0; left:0; right:0; background: rgba(255,255,255,0.95);
              backdrop-filter: blur(20px); border-bottom: 1px solid #e8e8e8; z-index:1000;
            }
            main { padding-top:80px; min-height:100vh; }
            @media (max-width:768px) { main { padding-top:70px; } }
            
            /* Admin-specific overrides - HIDE navbar/footer on admin pages */
            body.admin-page #public-navbar,
            body.admin-page #public-footer {
              display: none !important;
            }
            body.admin-page main {
              padding-top: 0 !important;
            }
          `,
          }}
        />

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Daily Instruct",
              "description": "Daily Instruct provides durable explainers and in-depth analysis across tech, business, markets, and global affairs—delivering the essential context professionals need to understand why things happen and what they mean.",
              "url": "https://www.dailyinstruct.com",
              "logo": "https://www.dailyinstruct.com/og-image.png",
              "sameAs": [
                "https://twitter.com/dailyinstruct",
                "https://www.linkedin.com/company/dailyinstruct"
              ]
            })
          }}
        />
        <Analytics />
        <AdminCSSInjector />
        <div id="public-navbar">
          {/* NAVBAR IS BACK! */}
          <Navbar />
        </div>
        <main>{children}</main>
        <div id="public-footer">
          {/* FOOTER IS BACK! */}
          <Footer />
        </div>
      </body>
    </html>
  );
}