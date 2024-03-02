import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

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
      <body className={openSans.className}>{children}</body>
    </html>
  );
}
