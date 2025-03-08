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
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased pt-4`}
    >
      {/* Navbar */}
      <header className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
        {/* Left side: App name */}
        <div className="text-xl font-bold text-green-600">
          plant vs interview
        </div>

        {/* Right side: User info */}
        <ClientUserInfo />
      </header>
    </div>
  );
}
