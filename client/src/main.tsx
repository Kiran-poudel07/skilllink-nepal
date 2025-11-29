import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./assets/CSS/global.css";
import RouterPathConfig from "./config/router.config";
import { AuthProvider } from "./context/auth.context";

// import { Provider } from "react-redux";
// import { store } from "./store/store";
// import { SocketProvider } from "./context/socket.context";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Provider store={store}> */}
      <AuthProvider>
        {/* <SocketProvider> */}
          <RouterPathConfig />
        {/* </SocketProvider> */}
      </AuthProvider>
    {/* </Provider> */}
  </StrictMode>
);
