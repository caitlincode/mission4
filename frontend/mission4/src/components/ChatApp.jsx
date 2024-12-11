import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatApp = () => {
  const [chatHistory, setChatHistory] = useState([]); // Holds the conversation history
  const [userMessage, setUserMessage] = useState(""); // User's input message
  const [loading, setLoading] = useState(true); // Indicates if the initial message is being fetched

  // Fetch Tina's initial message when the page loads
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/ask", {
          userResponse: "", // No user input for the initial message
          conversationHistory: [], // Empty conversation history
        });
        setChatHistory(response.data.conversationHistory); // Update chat history with Tina's first message
      } catch (error) {
        console.error("Error fetching initial message:", error);
      } finally {
        setLoading(false); // Stop loading spinner after fetching
      }
    };

    fetchInitialMessage();
  }, []);

  // Handle sending user messages
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages

    // Add the user's message to the chat history
    const updatedHistory = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMessage }] },
    ];

    setChatHistory(updatedHistory); // Update chat history in the UI

    try {
      // Send the user's message and conversation history to the backend
      const response = await axios.post("http://localhost:5000/api/ask", {
        userResponse: userMessage,
        conversationHistory: updatedHistory,
      });
      setChatHistory(response.data.conversationHistory); // Update chat history with Tina's response
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setUserMessage(""); // Clear the input field
  };

  return (
    <div>
      <h1>Talk to Tina!</h1>
      <div>
        {loading ? (
          <p>Loading Tina...</p>
        ) : (
          chatHistory.map((entry, index) => (
            <div key={index} className={entry.role}>
              <strong>{entry.role === "user" ? "You" : "Tina"}:</strong>{" "}
              {entry.parts[0].text}
            </div>
          ))
        )}
      </div>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
