import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./state/AuthContext";
import "./styles/theme.css";

// Ensure index.html contains a <div id="root"></div> for React to mount.
// Fix ReactDOM import for React 18 compatibility

const container = document.getElementById("root");
const root = container
  ? ReactDOM.createRoot(container)
  : null;

if (root) {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  // If #root missing, fail gracefully with message in body
  const fallback = document.createElement("div");
  fallback.innerText =
    "Error: Root element not found. Please ensure public/index.html contains <div id='root'></div>";
  document.body.appendChild(fallback);
}
