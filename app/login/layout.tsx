// /app/login/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Daily Instruct",
  description: "Admin login page for Daily Instruct",
  robots: "noindex, nofollow", // Don't index login page
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}