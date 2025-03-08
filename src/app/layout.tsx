// layout.tsx
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserLayout from "@/components/UserLayout";

export const metadata = {
  title: "Plant Vs. Interview",
  description: "Ace your next interview with Plant Vs. Interview",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <UserLayout>{children}</UserLayout>
          {/* Main content */}
        </body>
      </html>
    </ClerkProvider>
  );
}
