import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/ChatApp.css";  // Global styles for chat app

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
