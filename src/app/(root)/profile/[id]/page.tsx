"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore"; // Changed from getDoc
import { db } from "../../../../firebase";
import { useUser } from "@clerk/nextjs";
import PlantUpdate from "@/components/PlantFile";

export default function Home() {
  const [health, setHealth] = useState<number | null>(null);
  const { user, isSignedIn } = useUser(); // Clerk user authentication
  const [totalProblemsSolved, setTotalProblemsSolved] = useState(0);
  const [lastPracticed, setLastPracticed] = useState("");

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
            setTotalProblemsSolved(userData.questionsAnswered || 0);
            
            // Format timestamp into a readable date - removed weekday
            if (userData.lastUpdated) {
              const date = new Date(userData.lastUpdated.seconds * 1000);
              setLastPracticed(date.toLocaleDateString("en-US", { 
                year: "numeric", month: "long", day: "numeric" 
              }));
            } else {
              // Set a default formatted date
              const defaultDate = new Date();
              setLastPracticed(defaultDate.toLocaleDateString("en-US", { 
                year: "numeric", month: "long", day: "numeric" 
              }));
            }
          } else {
            // User doc doesn't exist yet, set default health
            setHealth(5);
            setTotalProblemsSolved(0);
            
            // Format the default date properly
            const defaultDate = new Date();
            setLastPracticed(defaultDate.toLocaleDateString("en-US", { 
              year: "numeric", month: "long", day: "numeric" 
            }));
          }
        },
        (error) => {
          console.error("Error getting updates", error);
        }
      );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans px-4">

      <div className="w-full max-w-7xl flex flex-col lg:flex-row justify-between items-center gap-12 mb-24"> 

        {/* Left Column - Health Bar & Last Practiced */}
        <div className="flex flex-col gap-6 w-full lg:w-1/3">
          <div className="flex flex-col items-start">
            <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-2">Your health bar</h2>
            <div className="w-full h-10 md:h-12 lg:h-16 bg-gray-200 rounded-lg">
              <div className="flex text-2xl font-semibold text-red-600 align-center justify-center mt-4">
                {health !== null ? "You have " + health + " health!" : "..."}
              </div>

            </div>
          </div>

          <div className="flex flex-col items-start">
            <h2 className="text-xl md:text-2xl font-bold text-gray-500 mb-2">Last practiced on:</h2>
            <div className="w-full h-10 md:h-12 lg:h-16 bg-gray-200 rounded-lg">
              <div className="flex font-semibold text-red-600 align-center justify-center mt-4">
                {lastPracticed ? "You last practiced " + lastPracticed + "!" : "..."}
              </div>
            </div> 

          </div>
        </div>

        {/* Center - Plant Image */}
        <div className="flex items-center justify-center w-full max-w-xs md:max-w-sm lg:max-w-md">
          <PlantUpdate width={300} height={600} />
        </div>
      {/* Right Column - Progress */}
        <div className="flex flex-col items-center w-full lg:w-1/3">
          <div className="w-full min-h-[20vh] md:min-h-[25vh] lg:min-h-[30vh] bg-gray-200 rounded-lg flex flex-col items-center justify-center text-center p-4">
            <p className="text-lg md:text-xl font-medium text-gray-700">Total Problems Solved</p>
            <p className="text-3xl md:text-6xl font-bold text-gray-900">{totalProblemsSolved}</p>
            <p className="text-lg md:text-xl font-medium text-gray-700">Keep it up!</p>
          </div>
        </div>
      </div>

      {/* Container for Title and Bookmark Icon */}
      <div className="w-full max-w-7xl flex items-center gap-3 mb-5 px-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 md:w-7 h-6 md:h-7 text-gray-500"
        >
          <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          <line x1="12" y1="8" x2="12" y2="14" />
          <line x1="9" y1="11" x2="15" y2="11" />
        </svg>

        <h2 className="text-2xl md:text-4xl font-bold text-gray-500">Bookmarked Questions</h2> 
      </div>

      {/* Centered, longer, rounded rectangle */}
      <div className="w-full max-w-7xl bg-gray-100 rounded-2xl py-6 md:py-8 px-6 md:px-8 shadow-lg mb-15"> 

    <div className="space-y-4">
      <p className="text-lg md:text-2xl text-gray-700">What is your biggest strength?</p>
      <p className="text-lg md:text-2xl text-gray-700">How do you handle challenges?</p>
      <p className="text-lg md:text-2xl text-gray-700">Describe a time you struggled. How did you overcome it?</p>
      <p className="text-lg md:text-2xl text-gray-500 font-medium cursor-pointer hover:text-gray-700 transition">See more</p> 
    </div>
    </div>

    </div>
  );
}