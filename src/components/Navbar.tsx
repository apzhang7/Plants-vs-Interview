"use client";

import { Geist, Geist_Mono } from "next/font/google";
import ClientUserInfo from "../components/ClientUserInfo";
import { useEffect, useState } from "react";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Navbar() {
  const [health, setHealth] = useState<number | null>(null);
  const { user, isSignedIn } = useUser(); // Clerk user authentication

  useEffect(() => {
    if (!user) return; // Exit if no user is logged in

    const fetchHealth = async () => {
      try {
        const userRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setHealth(userDoc.data().health || 5); // Default health to 5
        }
      } catch (error) {
        console.error("Error fetching user health:", error);
      }
    };

    fetchHealth();
  }, [user]);

  return (
      <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navbar */}
        <header className="flex justify-between items-center p-12 bg-hidden mt-2">
          {/* Left side: App name */}
          <div className="text-2xl font-bold text-black ml-0">
            <Link href="/">plants vs. interview</Link>
          </div>

          {/* Right side: Hearts and User info */}
          <div className="flex items-center">
            <div className="flex items-center text-2xl font-semibold text-red-600 mr-3 scale-150">
              ❤️ 
            </div>
            <div className="flex text-2xl font-semibold text-red-600 mr-15">
              {health !== null ? health : "..."}
            </div>
            <div>
              <ClientUserInfo />
            </div>
          </div>
        </header>
      </div>

  );
}
