import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function generateResponse(userMessage) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "You are Tina, an AI insurance consultant. Your task is to recommend insurance options..."},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "Hello! I'm Tina, your AI insurance consultant. Let's start by understanding your insurance needs."},
        ],
      },
      {
        role: "user",
        parts: [
          {text: userMessage},
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
