"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CreateQuestion from "@/components/CreateQuestion";
import CreateFeedback from "@/components/CreateFeedback";

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

  // const handleFeedbackSubmit = async () => {
  //   if (!feedback.trim()) return;

  //   setFeedbackLoading(true);
  //   try {
  //     const response = await fetch("http://localhost:3000/api/feedback", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ feedback }),
  //     });

  //     const data = await response.json();
  //     setFeedbackResponse(JSON.stringify(data, null, 2));
  //   } catch (error) {
  //     setFeedbackResponse(`Error: ${error}`);
  //   } finally {
  //     setFeedbackLoading(false);
  //   }
  // };

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center mb-8">
        Interview Buddy - API Tester
      </h1>

      <div className="">
        {/* Transcribe Route Tester */}
        {/* <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Transcribe Route</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setTranscribeFile(e.target.files?.[0] || null)}
            className="mb-4"
          />
          <Button
            onClick={handleTranscribe}
            disabled={!transcribeFile || transcribeLoading}
            className=""
          >
            {transcribeLoading ? "Processing..." : "Transcribe Audio"}
          </Button>

          {transcribeResponse && (
            <div className="mt-4">
              <h3 className="font-bold">Response:</h3>
              <pre className="bg-gray-100 p-2 rounded overflow-auto mt-2 text-sm">
                {transcribeResponse}
              </pre>
            </div>
          )}
        </div> */}

        {/* Questions Route Tester */}
        <CreateQuestion />

        {/* Feedback Route Tester */}
        {/* <div className="border p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Feedback Route</h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback here"
            className="w-full p-2 border rounded mb-4"
            rows={4}
          />
          <Button
            onClick={handleFeedbackSubmit}
            disabled={!feedback.trim() || feedbackLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
          >
            {feedbackLoading ? "Processing..." : "Submit Feedback"}
          </Button>

          {feedbackResponse && (
            <div className="mt-4">
              <h3 className="font-bold">Response:</h3>
              <pre className="bg-gray-100 p-2 rounded overflow-auto mt-2 text-sm">
                {feedbackResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div> */}
      </div>
    </div>
  );
}
