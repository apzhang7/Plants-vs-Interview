"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  doc,
  DocumentReference,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Textarea } from "@/components/ui/textarea";
import updateUserAfterFeedback from "@/components/UpdateProfileInfo";

const formSchema = z.object({
  industry: z.string().nonempty("Industry is required"),
  major: z.string().nonempty("Major is required"),
  question: z.string().nonempty("Question is required"),
  userResponse: z.string().nonempty("User response is required"),
});

interface CreateFeedbackProps {
  question: string;
  response: string;
  industry: string;
  major: string;
}

export default function CreateFeedback({
  question,
  industry,
  major,
}: CreateFeedbackProps) {
  const { user } = useUser();

  const [userResponse, setUserResponse] = useState("");
  const [feedbackResponse, setFeedbackResponse] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [questionDocRef, setQuestionDocRef] =
    useState<DocumentReference | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      major: "",
    },
  });

  const handleFeedbackSubmit = async () => {
    if (!userResponse.trim()) return;

    setFeedbackLoading(true);
    try {
      console.log("user response:", userResponse);
      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          response: userResponse,
          industry: industry,
          major: major,
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Feedback API response:", data);
      setFeedbackResponse(JSON.stringify(data, null, 2));

      const score = data.score;
      const numericScore = parseInt(score.split("/")[0]);

      if (user) {
        const userId = user.id;
        await updateUserAfterFeedback(userId, numericScore);

        const userDocRef = collection(db, "users", userId, "questions");

        const newQuestionDoc = doc(userDocRef);
        setQuestionDocRef(newQuestionDoc);

        await setDoc(newQuestionDoc, {
          question: question,
          response: userResponse,
          industry: industry,
          major: major,
          timestamp: new Date(),
          bookmarked: false,
        });
      }
      // console.log("userResponse:", userResponse);
      // console.log("industry:", industry);
      // track how many questions answered by user
    } catch (error) {
      setFeedbackResponse(`Error: ${error}`);
    } finally {
      setFeedbackLoading(false);
    }
  };
  const handleBookmarkSubmit = async () => {
    if (!questionDocRef || !user) return;

    try {
      // Update the database first
      const newBookmarkState = !isBookmarked;
      await updateDoc(questionDocRef, {
        bookmarked: newBookmarkState,
      });

      // Then update the UI state to match
      setIsBookmarked(newBookmarkState);

      console.log(
        `Question ${
          newBookmarkState ? "bookmarked" : "unbookmarked"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };
  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Response</h2>
      <div className="mt-6">
        <div className="mt-4">
          <h3 className="font-bold text-lg">Your Answer:</h3>
          <Textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            placeholder="Type your answer to the question here..."
            rows={5}
            className="w-full mt-2 p-3 border rounded"
          />

          <Button
            type="button"
            onClick={handleFeedbackSubmit}
            disabled={!userResponse.trim() || feedbackLoading}
            className="bg-[#4CAF50] hover:bg-[#388E3C] text-white mt-3"
          >
            {feedbackLoading ? "Processing..." : "Get Feedback"}
          </Button>

          <Button
            type="button"
            onClick={handleBookmarkSubmit}
            disabled={!questionDocRef}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
        </div>
      </div>

      {feedbackResponse && (
        <div className="mt-4">
          <h3 className="font-bold text-lg">Feedback:</h3>
          <pre className="bg-gray-100 p-3 rounded overflow-auto mt-2 text-sm">
            {feedbackResponse}
          </pre>
        </div>
      )}
    </div>
  );
}
