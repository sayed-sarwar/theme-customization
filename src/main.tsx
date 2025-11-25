import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "../src/styles/main.scss";
import { store } from "../store/store.ts";
import { Provider } from "react-redux";
// import Layout from "../src/layout/mainlayout.tsx";
// Assuming you have a Redux store instance

const reduxStoreSizeInBytes = JSON.stringify(store.getState()).length;

console.log(`Redux store size: ${reduxStoreSizeInBytes} bytes`);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
