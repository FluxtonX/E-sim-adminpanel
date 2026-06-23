import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthInitializer from "@/features/auth/components/AuthInitializer";
import QueryProvider from "@/components/shared/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "United Union | eSIM Management Platform",
  description: "Production-grade admin panel for eSIM configurations, analytics, and merchant operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#0f172a] antialiased">
        <QueryProvider>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </QueryProvider>
      </body>
    </html>
  );
}

