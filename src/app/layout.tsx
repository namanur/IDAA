import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "IDAA - CA Interview Prep",
  description: "Advanced CA Interview Preparation and Practice Platform",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${inter.variable} font-sans bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen antialiased`}>
        <Navbar />
        
        {/* Main Content Wrapper - Full width after removing sidebar */}
        <div className="pt-24 pb-20 md:pb-8 max-w-7xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
