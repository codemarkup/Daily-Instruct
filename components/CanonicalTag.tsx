'use client';
import { usePathname } from 'next/navigation';

export default function CanonicalTag() {
  const pathname = usePathname();
  // Strip trailing slashes unless it's just '/'
  const normalizedPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  return <link rel="canonical" href={`https://www.dailyinstruct.com${normalizedPath}`} />;
}
