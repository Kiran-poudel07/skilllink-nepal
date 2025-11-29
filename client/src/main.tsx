import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./assets/CSS/global.css";
import RouterPathConfig from "./config/router.config";
import { AuthProvider } from "./context/auth.context";



ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterPathConfig />
    </AuthProvider>
  </StrictMode>
);
