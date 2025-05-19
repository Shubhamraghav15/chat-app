import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // Tailwind + Flowbite import
import App from "./App";
import "flowbite";
import { NotificationsProvider } from "./auth/NotificationsContext"; // ✅ new

// Entry point for React 18+ with Vite
const container = document.getElementById("root");
const root = createRoot(container);
console.log("👋 index.jsx is running, container:", container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
    {/* <NotificationsProvider> */}

      <App />
    {/* </NotificationsProvider> */}
    </BrowserRouter>
  </React.StrictMode>,
);
