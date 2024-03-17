import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Open_Sans } from "next/font/google";
import { Toaster } from "./components/ui/toaster";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "🌱 domainSprout",
  description: "Turn your ideas into domain names",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}