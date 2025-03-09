"use client";
import React, { useState } from "react";
import { MessageCircleQuestion, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuestionForm } from "@/components/UseCreateQuestionForm";
export default function NewQuestionPage() {
  const {
    form,
    questionResponse,
    questionLoading,
    hasUserResponse,
    handleQuestionSubmit,
  } = useQuestionForm();
  const [answer, setAnswer] = useState(""); // Stores the user's response
  const [feedbackResponse, setFeedbackResponse] = useState(""); // Stores feedback
  const [feedbackLoading, setFeedbackLoading] = useState(false); // Loading state for feedback
  // Assuming industry and major are collected via the form
  const industry = form.watch("industry");
  const major = form.watch("major");
  // Function to handle feedback submission (mimics CreateFeedback's functionality)
  const handleFeedbackSubmit = async () => {
    if (!answer.trim()) return;
    setFeedbackLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionResponse,
          response: answer,
          industry: industry,
          major: major,
        }),
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      setFeedbackResponse(JSON.stringify(data, null, 2));
      console.log("userResponse:", answer);
      console.log("industry:", industry);
      console.log("Feedback API response:", data);
    } catch (error) {
      setFeedbackResponse(`Error: ${error}`);
    } finally {
      setFeedbackLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center p-4">
      {/* Top Bar with Title and Icons */}
      <div className="flex justify-between w-full items-center mb-4">
        <h1 className="text-2xl font-bold">Plants vs. Interview</h1>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-2 text-lg">7</span>
          </div>
          <div className="flex items-center">
            <span className="text-red-500">❤️</span>
            <span className="ml-2 text-lg">5</span>
          </div>
        </div>
      </div>
      {/* Main container with two halves: left for tree image and right for question box */}
      <div className="flex w-full mb-12">
        {/* Tree Image Section */}
        <div className="w-1/3 ml-8 flex justify-center items-center">
          <img src="p1s1.png" alt="Tree" className="max-w-[54%] h-auto" />
        </div>
        {/* Right Section */}
        <div className="w-2/3 flex flex-col justify-start space-y-6 mt-24">
          {/* Industry and Major in Horizontal Layout */}
          <form onSubmit={form.handleSubmit(handleQuestionSubmit)}>
            <div className="flex space-x-4 max-w-[80%] mb-6">
              {/* Industry Box */}
              <div className="flex-1 p-4 rounded-lg bg-[#F2F2F2]">
                <p className="text-[#B9B0B0]">What's your industry?</p>
                <input
                  type="text"
                  placeholder="Enter your industry"
                  className="mt-2 p-2 w-full rounded text-[#B9B0B0] bg-transparent focus:outline-none"
                  {...form.register("industry")}
                />
              </div>
              {/* Major Box */}
              <div className="flex-1 p-4 rounded-lg bg-[#F2F2F2]">
                <p className="text-[#B9B0B0]">What's your major?</p>
                <input
                  type="text"
                  placeholder="Enter your major"
                  className="mt-2 p-2 w-full rounded text-[#B9B0B0] bg-transparent focus:outline-none"
                  {...form.register("major")}
                />
              </div>
            </div>
            {/* Question Display Box */}
            <div className="p-4 rounded-lg bg-[#F2F2F2] max-w-[80%] min-h-[100px] mt-6 mb-4">
              <p className="text-[#B9B0B0]">
                {questionResponse ? questionResponse : "Your generated question will appear here."}
              </p>
            </div>
            {/* Buttons with Lucide Icons */}
            <div className="flex justify-end space-x-4" style={{ maxWidth: "80%" }}>
              <button
                type="submit"
                className="flex items-center space-x-2 text-[#B9B0B0] hover:text-opacity-100 focus:outline-none"
                disabled={questionLoading}
              >
                <MessageCircleQuestion className="w-6 h-6" />
                <span>{questionLoading ? "Loading..." : "Generate Question"}</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 text-[#B9B0B0] hover:text-opacity-100 focus:outline-none"
                onClick={() => console.log("Bookmark clicked")}
              >
                <BookmarkPlus className="w-6 h-6" />
                <span>Bookmark</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Answer Input Box */}
      <div className="w-full flex flex-col items-center mb-12">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-[75%] h-20 p-4 bg-[#ECFFE9] border border-gray-300 rounded-xl text-gray-500 text-opacity-50 placeholder-gray-500 placeholder-opacity-50"
          placeholder="Enter your response to the interview prompt here!"
        />
        <p className="text-gray-400 text-sm mt-2">Hint: Longer answers are better most of the time!</p>
      </div>
      {/* Finish Button */}
      <button
        onClick={handleFeedbackSubmit} // Now, the "I'm Finished" button triggers the feedback submission
        className="text-gray-700 bg-[#A1D1A5] px-8 py-3 rounded-full hover:bg-[#90C190] focus:outline-none mb-4"
        disabled={feedbackLoading} // Disable button while feedback is loading
      >
        {feedbackLoading ? "Processing..." : "I'm Finished!"}
      </button>
      {/* Display Feedback */}
      {feedbackResponse && (
        <div className="mt-4 w-[75%]">
          <h3 className="font-bold text-lg">Feedback:</h3>
          <pre className="bg-gray-100 p-3 rounded overflow-auto mt-2 text-sm">
            {feedbackResponse}
          </pre>
        </div>
      )}
    </div>
  );
}
