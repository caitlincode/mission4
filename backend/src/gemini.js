import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in the .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 256,
  responseMimeType: "text/plain",
};

const context = `
- Mechanical Breakdown Insurance (MBI): Covers repair costs for unexpected mechanical failures. Not available for trucks or racing cars.
- Comprehensive Car Insurance: Covers both your car and others in an accident. Available only for vehicles under 10 years old.
- Third Party Car Insurance: Covers damages to other people's property.
`;

export async function generateResponse(userMessage) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `You are Tina, an AI insurance consultant. Use the following context to assist the user: ${context} User's question: ${userMessage}`,
          },
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
}
