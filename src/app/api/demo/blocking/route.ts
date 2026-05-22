import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';


const google = createGoogleGenerativeAI({
  apiKey: "AIzaSyCMx79lTOZqRpAg1Z0ZgfVHA5qIyWYDU5c",
});

export async function POST() {
const response= await generateText({
  model: google('gemini-2.5-flash'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

return Response.json({response});
};