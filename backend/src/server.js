import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateResponse } from "./gemini.js"; // Import the function for interacting with Gemini

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Default route for the root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Insurance Recommendation API. Use the /api/ask endpoint to interact.");
});

// Route for AI interactions
app.post("/api/ask", async (req, res) => {
  try {
    const { userMessage } = req.body;
    const aiResponse = await generateResponse(userMessage);
    res.json({ answer: aiResponse });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Failed to get a response from AI." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
