// app/AdminCSSInjector.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminCSSInjector() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdminPage) {
      document.body.classList.add('admin-page');
    } else {
      document.body.classList.remove('admin-page');
    }
  }, [isAdminPage]);

  return null; // This component doesn't render anything visible
}