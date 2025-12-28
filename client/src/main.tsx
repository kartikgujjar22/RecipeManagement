// client\src\main.tsx

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Proper way to get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(<App />);
}