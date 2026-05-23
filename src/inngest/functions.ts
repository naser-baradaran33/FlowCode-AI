// src/inngest/functions.ts
import { generateText } from "ai";
import { inngest } from "./client";
import { anthropic } from "@ai-sdk/anthropic";


const URL_REGEX = /https?:\/\/[^\s]+/g;

export const demoGenerate = inngest.createFunction(
  {
    id: "demo-generate",
    triggers: [{ event: "demo/generate" }],
  },
  async ({ event, step }) => {
    const { prompt } = event.data as { prompt: string };

    const urls = await step.run("extract-urls", async () => {
      return prompt.match(URL_REGEX) ?? [];

    }) as string[];


    await step.run("generate-text", async () => {
      return await generateText({
  model: anthropic('claude-3-haiku-20240307'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
  });
  }
);
