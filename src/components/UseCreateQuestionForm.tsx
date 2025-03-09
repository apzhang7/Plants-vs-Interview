// hooks/useQuestionForm.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  industry: z.string().nonempty("Industry is required"),
  major: z.string().nonempty("Major is required"),
});

export function useQuestionForm() {
  const [questionResponse, setQuestionResponse] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
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
        body: JSON.stringify({ industry, major }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Question API response:", data);
      setQuestionResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Question API error:", error);
      setQuestionResponse(`Error: ${error}`);
    } finally {
      setQuestionLoading(false);
      setHasUserResponse(true);
    }
  };

  return {
    form,
    questionResponse,
    questionLoading,
    hasUserResponse,
    userResponse,
    setUserResponse,
    handleQuestionSubmit,
  };
}