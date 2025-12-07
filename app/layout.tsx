'use client'; // Add this for client-side detection

import React from 'react';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body>
        {/* Hide Navbar on admin pages */}
        {!isAdminRoute && <Navbar />}
        <main>
          {children}
        </main>
        {/* Hide Footer on admin pages */}
        {!isAdminRoute && <Footer />}
      </body>
    </html>
  );
}