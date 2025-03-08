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
import { db } from "../firebase";

const formSchema = z.object({
  industry: z.string().nonempty("Industry is required"),
  major: z.string().nonempty("Major is required"),
});

export default function Home() {
  const [transcribeFile, setTranscribeFile] = useState<File | null>(null);
  const [transcribeResponse, setTranscribeResponse] = useState("");
  const [transcribeLoading, setTranscribeLoading] = useState(false);

  const handleResponse = async () => {
    if (!transcribeFile) return;

    setTranscribeLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", transcribeFile);

      const response = await fetch("http://localhost:3000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setTranscribeResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setTranscribeResponse(`Error: ${error}`);
    } finally {
      setTranscribeLoading(false);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      major: "",
    },
  });

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
      <h1 className="text-4xl font-bold text-center mb-8">
        Interview Buddy - API Tester
      </h1>

      <CreateQuestion />

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
