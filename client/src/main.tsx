import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./globals.css";
import { QueryProvider } from "./lib/react-query/QueryProvider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import Navbar from "./components/Navbar.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  </React.StrictMode>
);
