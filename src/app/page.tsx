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
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const formSchema = z.object({
  industry: z.string().nonempty("Industry is required"),
  major: z.string().nonempty("Major is required"),
});

export default function Home() {
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
    <div className="min-h-screen">
      {/* <h1 className="text-4xl font-bold text-center mb-8">
        // Interview Buddy - API Tester //
      </h1>
      // <CreateQuestion /> */}
      <div className="items-center justify-center flex-grow">
        <SignedIn>
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
        </SignedIn>
        <SignedOut>
          <div className="flex justify-between bg-[#C1DEC3] min-h-screen items-center gap-8">
            <div className="absolute top-6 left-8 z-10">
              <h1 className="text-2xl font-bold text-black">
                plants vs. interview
              </h1>
            </div>
            <div className="flex-col p-8 rounded-lg">
              <h1 className="text-8xl font-semibold text-start mb-4">
                Grow your interviewing skills
                <span className="text-4xl text-start font-light italic block mt-2">
                  with our AI-powered interview assistant.
                </span>
              </h1>
              <div className="flex gap-4">
                <SignUpButton mode="modal">
                  <button className="bg-white text-black font-normal py-2 w-32 rounded-sm shadow-md hover:gray transition duration-300">
                    sign up
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="bg-white text-black font-normal py-2 w-32 rounded-sm shadow-md hover:gray transition duration-300">
                    log in
                  </button>
                </SignInButton>
              </div>
            </div>
            <div className="flex flex-col bg-white min-h-screen justify-center items-center px-16">
              <Image
                src="/plant1stage1new.png"
                alt="Plant"
                width={500}
                height={700}
              />
            </div>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
