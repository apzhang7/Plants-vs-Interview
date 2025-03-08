"use client";

import { useAuth, useUser, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
//
import { useEffect, useState } from "react";
import { doc, getDocs, setDoc } from "firebase/firestore";
import { db } from '../firebase'

export default function Home() {
  const { isSignedIn } = useAuth(); // For authentication status
  const { user } = useUser(); // For accessing the user object

  const [firestoreData, setFirestoreData] = useState(null); // State to store Firestore data
  const [loading, setLoading] = useState(false); // Loading state for data fetch

  useEffect(() => {
    if (user) {
      const userData = {
        email: user.emailAddresses[0]?.emailAddress || "",
        fullname: `${user.firstName} ${user.lastName}` || "",
      };

      if (userData.email && userData.fullname) {
        const userDocRef = doc(db, "users", user.id);

        setDoc(userDocRef, userData)
        .then(() => {
          console.log("User data stored successfully");
        })
        .catch((error) => {
          console.error("Error storing user data:", error);
        });
      }
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-center flex-grow p-8">
        {isSignedIn ? (
          <div>
            <p>Welcome, {user?.firstName}!</p>

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
          <div>
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
      </main>
    </div>
  );
}






























































