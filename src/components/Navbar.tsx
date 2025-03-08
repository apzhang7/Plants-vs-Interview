"use client";

import { Geist, Geist_Mono } from "next/font/google";
import ClientUserInfo from "../components/ClientUserInfo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Navbar() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* Navbar */}
      <header className="flex justify-between items-center p-12 bg-hidden mt-2">
        {/* Left side: App name */}
        <div className="text-2xl font-bold text-black ml-0">
          plants vs. interview
        </div>

        {/* Right side: User info */}
        <div className="mr-6">
          <ClientUserInfo />
        </div>
      </header>
    </div>
  );
}
