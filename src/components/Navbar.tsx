"use client";

import { Geist, Geist_Mono } from "next/font/google";
import ClientUserInfo from "../components/ClientUserInfo";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore"; // Changed from getDoc
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

    // Set up a real-time listener instead of a one-time fetch
    const userRef = doc(db, "users", user.id);

    // This creates a subscription that updates whenever the data changes
    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setHealth(userData.health || 5);
          console.log("Health updated:", userData.health);
        } else {
          // User doc doesn't exist yet, set default health
          setHealth(5);
        }
      },
      (error) => {
        console.error("Error listening to health updates:", error);
      }
    );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
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
          <div className="flex items-center mr-3 scale-150">
            ❤️
          </div>
          <div className="flex text-2xl font-semibold text-red-600 mr-8">
            {health !== null ? health : "..."}
          </div>

          {isSignedIn && user ? (
            <Link href={`/profile/${user.id}`}>
              <button className="bg-green-200 text-black font-normal py-3 mr-10 w-32 -mt-2 rounded-sm shadow-md hover:bg-green-300 transition duration-300">
                My Profile
              </button>
            </Link>
          ) : (
                <button className="disabled bg-green-200 text-black font-normal py-3 mr-10 w-32 -mt-2 rounded-sm shadow-md hover:bg-green-300 transition duration-300 cursor-not-allowed">
                  My Profile
                </button>
          )}
          <div>
            <ClientUserInfo />
          </div>
        </div>
      </header>
    </div>
  );
}
