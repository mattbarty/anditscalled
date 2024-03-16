import type { Metadata } from "next";
import Head from 'next/head'; // <-- Import the Head component
import { Open_Sans } from "next/font/google";
import { Toaster } from "./components/ui/toaster";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "anditscalled",
  description: "startup domain name generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>
      <body className={openSans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}