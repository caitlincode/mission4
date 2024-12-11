import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { generateResponse } from "./gemini.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Insurance Recommendation API. Use the /api/ask endpoint to interact.");
});

// AI interaction endpoint
app.post("/api/ask", async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage || typeof userMessage !== "string") {
    return res.status(400).json({ error: "Invalid input. Please provide a valid message." });
  }

  try {
    const aiResponse = await generateResponse(userMessage);
    res.json({ answer: aiResponse });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Failed to process your request." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
