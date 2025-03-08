"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
import CreateFeedback from "@/components/CreateFeedback";

const formSchema = z.object({
  industry: z.string().nonempty("Industry is required"),
  major: z.string().nonempty("Major is required"),
});

export default function CreateQuestion() {
  const [questionResponse, setQuestionResponse] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionText, setQuestionText] = useState("");

  const [userResponse, setUserResponse] = useState("");
  const [hasUserResponse, setHasUserResponse] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      industry: "",
      major: "",
    },
  });

  const handleQuestionSubmit = async (values: z.infer<typeof formSchema>) => {
    setQuestionLoading(true);
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
      console.log("Question API response:", data);

      // Store the formatted JSON for display
      setQuestionResponse(JSON.stringify(data, null, 2));

      // Extract just the question text from the response
      if (data.question) {
        setQuestionText(data.question);
      }
    } catch (error) {
      console.error("Question API error:", error);
      setQuestionResponse(`Error: ${error}`);
    } finally {
      setQuestionLoading(false);
      setHasUserResponse(true);
    }
  };

  return (
    <div className="border p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Questions Route</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleQuestionSubmit)}>
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xl">Industry</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    type="text"
                    placeholder="Enter an industry..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-[#FFC107]">
                  Enter any industry you want to generate questions for.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xl">Major</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    type="text"
                    placeholder="Enter a major..."
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-[#FFC107]">
                  Enter your major or career field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={questionLoading}
            className="bg-[#FFA726] hover:bg-[#FB8C00] text-[#FFF3E0]"
          >
            {questionLoading ? "Processing..." : "Generate Question"}
          </Button>

          {questionResponse && (
            <div className="mt-4">
              <h3 className="font-bold text-lg">Question:</h3>
              <pre className="bg-gray-100 p-3 rounded overflow-auto mt-2 text-sm">
                {questionResponse}
              </pre>
            </div>
          )}
        </form>
      </Form>

      {hasUserResponse && (
        <CreateFeedback
          question={questionText} // Pass the question text instead of JSON string
          response={userResponse}
          industry={form.getValues("industry")}
          major={form.getValues("major")}
        />
      )}
    </div>
  );
}
