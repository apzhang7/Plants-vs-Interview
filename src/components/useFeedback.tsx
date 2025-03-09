"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import updateUserAfterFeedback from "@/components/UpdateProfileInfo";

export function useFeedback() {
  const { user } = useUser();
  const [feedbackResponse, setFeedbackResponse] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [savedQuestionId, setSavedQuestionId] = useState<string | null>(null);

  const handleFeedbackSubmit = async ({
    question,
    response,
    industry,
    major,
  }: {
    question: string;
    response: string;
    industry: string;
    major: string;
  }) => {
    if (!response.trim()) return;

    setFeedbackLoading(true);
    try {
      console.log("Submitting feedback:", {
        question,
        response,
        industry,
        major,
      });

      const apiResponse = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          response,
          industry,
          major,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error(`API responded with status: ${apiResponse.status}`);
      }

      const data = await apiResponse.json();
      console.log("Feedback API response:", data);
      setFeedbackResponse(JSON.stringify(data, null, 2));

      // Save to Firebase if user is authenticated
      if (user && data.score) {
        const score = data.score;
        const numericScore = parseInt(score.split("/")[0]);

        // Update user profile with the score
        await updateUserAfterFeedback(user.id, numericScore);

        // Create a reference to the questions collection
        const userDocRef = collection(db, "users", user.id, "questions");
        const newQuestionDoc = doc(userDocRef);

        // Save the document ID
        const newQuestionId = newQuestionDoc.id;
        setSavedQuestionId(newQuestionId);

        // Save to Firestore
        await setDoc(newQuestionDoc, {
          question,
          response,
          industry,
          major,
          timestamp: new Date(),
          bookmarked: false,
        });

        console.log("Question saved to database with ID:", newQuestionId);
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedbackResponse(`Error: ${error}`);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return {
    feedbackResponse,
    feedbackLoading,
    savedQuestionId,
    handleFeedbackSubmit,
  };
}
