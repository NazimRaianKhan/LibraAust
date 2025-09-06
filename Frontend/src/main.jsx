import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./state/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <UserProvider> */}
      <AuthProvider>
        <App />
      </AuthProvider>
      {/* </UserProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);
