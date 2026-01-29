// app/AdminLayoutCheck.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminLayoutCheck() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Add admin-page class to body when on admin pages
    if (isAdminPage) {
      document.body.classList.add('admin-page');
      // Also remove any main padding
      const main = document.querySelector('main');
      if (main) {
        main.style.paddingTop = '0';
      }
    } else {
      document.body.classList.remove('admin-page');
    }
  }, [isAdminPage]);

  // Don't render navbar/footer on admin pages
  if (isAdminPage) {
    return null;
  }

  // Render navbar/footer for non-admin pages
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
}