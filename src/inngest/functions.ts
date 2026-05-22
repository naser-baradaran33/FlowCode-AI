// src/inngest/functions.ts
import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";

export const demoGenerate = inngest.createFunction(
  {
    id: "demo-generate",
    triggers: [{ event: "test/demo.generate" }],
  },
  async ({ step }) => {
    const { text } = await step.run("generate-text", async () => {
      return await generateText({
        model: google("gemini-2.5-flash"),
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
      });
    });

    return { text };
  }
);
