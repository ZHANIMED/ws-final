import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// ✅ Redux
import { Provider } from "react-redux";
import store from "./JS/Store/store"; // ✅ chemin selon ta structure

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

