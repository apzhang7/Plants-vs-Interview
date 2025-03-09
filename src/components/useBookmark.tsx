"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export function useBookmark() {
  const { user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkSubmit = async ({
    questionId, // New parameter to identify which question to update
    question,
    response,
    industry,
    major,
  }: {
    questionId: string; // Document ID of the existing question
    question: string;
    response: string;
    industry: string;
    major: string;
  }) => {
    if (!user || !questionId) return;

    try {
      // Reference the existing question document
      const questionDocRef = doc(db, "users", user.id, "questions", questionId);

      // Toggle bookmark state
      const newBookmarkState = !isBookmarked;

      // Update the existing question's bookmark status
      await updateDoc(questionDocRef, {
        bookmarked: newBookmarkState,
      });

      // Update UI state
      setIsBookmarked(newBookmarkState);
      console.log(
        `Question ${
          newBookmarkState ? "bookmarked" : "unbookmarked"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating bookmark status:", error);
    }
  };

  return { isBookmarked, setIsBookmarked, handleBookmarkSubmit };
}
