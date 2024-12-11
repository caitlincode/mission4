// Load environment variables from .env file
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import bodyParser from "body-parser";

dotenv.config();

// Ensure the API key is set
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not set in the environment variables.");
  process.exit(1);
}

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize the Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Define the system prompt for Tina
const tinaPrompt = {
  system: `You are Tina, an AI insurance consultant with a friendly, witty, and engaging personality. 
  Your job is to help users select the best insurance policy for their needs. Start by introducing yourself 
  and asking the user if they consent to answering a few personal questions to provide the best recommendation. 
  If the user agrees, ask follow-up questions to uncover details such as vehicle type, age, or usage. 
  Use humor and charm to keep the conversation engaging, but always remain professional and informative.

  Products and Rules:
  1. Mechanical Breakdown Insurance (MBI): Covers repair costs for mechanical failures. Not available for trucks and racing cars.
  2. Comprehensive Car Insurance: Covers damage to the vehicle and third parties. Only available for vehicles less than 10 years old.
  3. Third Party Car Insurance: Covers damage caused to other vehicles or property, but not to the insured vehicle.

  At the end of the conversation, recommend one or more insurance products and provide a clear explanation of why the recommendation is suitable. 
  Do not directly ask the user which insurance product they want; instead, uncover relevant details through your questions.`,
};

// Root endpoint for testing
app.get("/", (req, res) => {
  res.send("Welcome to Tina's Insurance Chatbot API!");
});

// Endpoint for AI interactions
app.post("/api/ask", async (req, res) => {
  const { userResponse, conversationHistory: clientHistory } = req.body;

  // Initialize conversation history if not provided
  let conversationHistory = clientHistory || [];

  // If the conversation history is empty, Tina starts the conversation
  if (!clientHistory || clientHistory.length === 0) {
    const initialMessage = {
      role: "model",
      parts: [
        {
          text: "Hi there! I’m Tina, your friendly AI insurance consultant. I help people choose the right insurance policy for their needs. May I ask you a few personal questions to make sure I recommend the best policy for you?",
        },
      ],
    };

    // Tina starts the conversation
    conversationHistory.push(initialMessage);
    return res.json({ aiResponse: initialMessage.parts[0].text, conversationHistory });
  }

  // Add the user's response to the conversation history
  if (userResponse) {
    conversationHistory.push({
      role: "user",
      parts: [{ text: userResponse }],
    });
  }

  // Construct the prompt dynamically based on the conversation history
  const prompt = `
    ${tinaPrompt.system}
    The conversation history so far:
    ${conversationHistory
      .map((msg) => `${msg.role}: ${msg.parts[0].text}`)
      .join("\n")}`;

  try {
    // Use the `gemini-1.5-flash` model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the model
    const result = await model.generateContent(prompt);

    // Extract AI's response
    const aiResponse = result.response.text();

    // Add the AI's response to the conversation history
    conversationHistory.push({
      role: "model",
      parts: [{ text: aiResponse }],
    });

    // Send back the AI's response and updated conversation history
    res.json({ aiResponse, conversationHistory });
  } catch (error) {
    console.error("Error occurred during API call:", error.message);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
