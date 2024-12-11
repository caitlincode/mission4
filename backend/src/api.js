import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const context = `
- Mechanical Breakdown Insurance (MBI): Covers repair costs for unexpected mechanical failures. Not available for trucks or racing cars.
- Comprehensive Car Insurance: Covers both your car and others in an accident. Available only for vehicles under 10 years old.
- Third Party Car Insurance: Covers damages to other people's property.
`;

export const getAIResponse = async (userMessage) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/gemini-1.5-flash/completions",
        {
          prompt: `You are Tina, an AI insurance consultant. Use the following context to assist the user: ${context} User's question: ${userMessage}`,
          model: "gemini-1.5-flash",
          temperature: 0.7,
          max_tokens: 256,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      
      console.log(response.data); // Log the full response from Gemini
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error("Error communicating with Google Gemini API:", error);
      return "Sorry, I encountered an error while processing your request.";
    }
  };
  
