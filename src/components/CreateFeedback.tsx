"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
  const [questionResponse, setQuestionResponse] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  const [generatedQuestion, setGeneratedQuestion] = useState("");
  const [userResponse, setUserResponse] = useState("");
  const [feedbackResponse, setFeedbackResponse] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [currentValues, setCurrentValues] = useState({
    industry: "",
    major: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      major: "",
    },
  });

  // const handleQuestionSubmit = async (values: z.infer<typeof formSchema>) => {
  //   setQuestionLoading(true);
  //   try {
  //     const { industry, major, question, userResponse } = values;
  //     setCurrentValues({ industry, major });
  //     console.log("Submitting values:", { industry, major });

  //     const response = await fetch("http://localhost:3000/api/questions", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         industry,
  //         major,
  //         question,
  //         userResponse,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`API responded with status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("Question API response:", data);
  //     setQuestionResponse(JSON.stringify(data, null, 2));

  //     // Extract the question from response
  //     if (data.question) {
  //       setGeneratedQuestion(data.question);
  //     }
  //   } catch (error) {
  //     console.error("Question API error:", error);
  //     setQuestionResponse(`Error: ${error}`);
  //   } finally {
  //     setQuestionLoading(false);
  //   }
  // };

  const handleFeedbackSubmit = async () => {
    if (!userResponse.trim()) return;

    setFeedbackLoading(true);
    try {
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
      setFeedbackResponse(JSON.stringify(data, null, 2));
      console.log("userResponse:", userResponse);
      console.log("industry:", industry);
      console.log("Feedback API response:", data);
    } catch (error) {
      setFeedbackResponse(`Error: ${error}`);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Your Response</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFeedbackSubmit)}>
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
                onClick={handleFeedbackSubmit}
                disabled={!userResponse.trim() || feedbackLoading}
                className="bg-[#4CAF50] hover:bg-[#388E3C] text-white mt-3"
              >
                {feedbackLoading ? "Processing..." : "Get Feedback"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

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
