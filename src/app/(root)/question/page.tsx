"use client"; // This marks the file as a client component
import { useState } from "react";
import { MessageCircleQuestion, BookmarkPlus } from "lucide-react"; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  industry: z.string().nonempty("Industry is required"),
  major: z.string().nonempty("Major is required"),
});

export default function QuestionsPage() {
  const [question, setQuestion] = useState("What will we test you on?");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Form handling
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      major: "",
    },
  });

  // Handle question generation
  const handleQuestionSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { industry, major } = values;
      console.log("Submitting values:", { industry, major });
      const response = await fetch("http://localhost:3000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          industry,
          major,
        }),
      });
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      const data = await response.json();
      setQuestion(data.generatedQuestion || "No question available");
    } catch (error) {
      console.error("Question API error:", error);
      setQuestion(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = () => {
    // Logic to bookmark the question
    alert("Question bookmarked!");
  };

  const handleSubmitAnswer = async () => {
    try {
      console.log("Answer submitted:", answer);
    } catch (error) {
      console.error("Error processing the response:", error);
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
          <img src="three_leaf.png" alt="Tree" className="max-w-[54%] h-auto" />
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
                <p className="text-[#B9B0B0]">{question}</p>
            </div>

            {/* Buttons with Lucide Icons */}
            <div className="flex justify-end space-x-4" style={{ maxWidth: "80%" }}>
              <button
                type="submit"
                className="flex items-center space-x-2 text-[#B9B0B0] hover:text-opacity-100 focus:outline-none"
                disabled={loading}
              >
                <MessageCircleQuestion className="w-6 h-6" />
                <span>{loading ? "Loading..." : "Generate Question"}</span>
              </button>
              <button
                type="button"
                className="flex items-center space-x-2 text-[#B9B0B0] hover:text-opacity-100 focus:outline-none"
                onClick={handleBookmark}
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
        onClick={handleSubmitAnswer}
        className="text-gray-700 bg-[#A1D1A5] px-8 py-3 rounded-full hover:bg-[#90C190] focus:outline-none mb-4"
      >
        I'm Finished!
      </button>
    </div>
  );
}