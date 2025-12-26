// /app/login/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin Login - Daily Instruct",
  description: "Admin login page for Daily Instruct",
  robots: "noindex, nofollow",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading login page...</div>}>
      {children}
    </Suspense>
  );
}