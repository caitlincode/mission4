import { useState } from "react";
import axios from "axios";

// ChatWindow component to display chat history
const ChatWindow = ({ chatHistory }) => (
  <div className="chat-window">
    {chatHistory.map((entry, index) => (
      <div key={index} className={`message ${entry.sender}`}>
        <strong>{entry.sender === "user" ? "You" : "Tina"}:</strong>
        <p>{entry.message}</p>
      </div>
    ))}
  </div>
);

// ChatInput component to handle user input
const ChatInput = ({ userMessage, handleUserMessageChange, handleSendMessage }) => (
  <div className="input-container">
    <input
      type="text"
      value={userMessage}
      onChange={handleUserMessageChange}
      placeholder="Ask Tina about insurance..."
    />
    <button onClick={handleSendMessage}>Send</button>
  </div>
);

// Main ChatApp component
const ChatApp = () => {
  const [userMessage, setUserMessage] = useState(""); // User's input message
  const [chatHistory, setChatHistory] = useState([]); // Holds the chat history (user and Tina)

  // Handle changes in the user input field
  const handleUserMessageChange = (e) => {
    setUserMessage(e.target.value);
  };

  // Handle sending the message
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Don't send if the input is empty

    // Add user message to chat history
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: userMessage },
    ]);

    try {
      // Send the user message to the backend (API)
      const response = await axios.post("http://localhost:5000/api/ask", {
        userMessage,
      });

      // Add Tina's response to the chat history
      setChatHistory((prev) => [
        ...prev,
        { sender: "tina", message: response.data.answer },
      ]);
    } catch (error) {
      // Handle error from backend and notify user
      setChatHistory((prev) => [
        ...prev,
        { sender: "tina", message: "Sorry, there was an error processing your request." },
      ]);
    }

    // Clear the input field after sending
    setUserMessage("");
  };

  return (
    <div className="chat-app">
      <h1>Talk to Tina!</h1>
      <ChatWindow chatHistory={chatHistory} />
      <ChatInput
        userMessage={userMessage}
        handleUserMessageChange={handleUserMessageChange}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatApp;
