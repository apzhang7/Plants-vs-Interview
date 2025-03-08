"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CreateQuestion from "@/components/CreateQuestion";
import CreateFeedback from "@/components/CreateFeedback";
import { useAuth, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Image from "next/image";

export default function Home() {
  const { isSignedIn } = useAuth(); // For authentication status
  const { user } = useUser(); // For accessing the user object

  const [firestoreData, setFirestoreData] = useState(null); // State to store Firestore data
  const [loading, setLoading] = useState(false); // Loading state for data fetch

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-grow items-center justify-between p-8">
        {/* Left Section: Welcome Message */}
        {isSignedIn ? (
          <div className="flex-1">
            <p
              className="text-green-600 font-bold"
              style={{ fontSize: "15vh" }}
            >
              Welcome, {user?.firstName}!
            </p>

            {/* Display loading state or fetched Firestore data */}
            {loading ? (
              <p>Loading Firestore data...</p>
            ) : firestoreData ? (
              <div>
                <h3>Firestore Data:</h3>
                {/* <pre>{JSON.stringify(firestoreData, null, 2)}</pre> */}
              </div>
            ) : (
              <p>No Firestore data found.</p>
            )}
          </div>
        ) : (
          <div className="flex-1">
            <p>Please sign in to continue.</p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300">
                Sign up
              </button>
            </SignUpButton>
          </div>
        )}

        <div className="flex justify-center items-center">
          <Image
            src="/p1s3.png"
            width={800}
            height={1200}
            alt="Plant"
          />
        </div>
      </main>
    </div>
  );
}
