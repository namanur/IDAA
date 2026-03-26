import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNavbar from "@/components/layout/MobileNavbar";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${manrope.variable} font-sans bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen antialiased`}>
        <Navbar />
        <Sidebar />
        <MobileNavbar />
        
        {/* Main Content Wrapper - Accounting for Sidebar on LG screens and Navbar on top */}
        <div className="lg:ml-64 pt-24 pb-20 md:pb-8">
          {children}
        </div>
      </body>
    </html>
  );
}
