import "@/components/keenicons/assets/styles.css";
import "./styles/globals.css";

/* STORE */
import { Providers } from "@/store/Provider";

import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ProvidersWrapper } from "./providers";
import React from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Providers>
      <ProvidersWrapper>
        <App />
      </ProvidersWrapper>
    </Providers>
  </React.StrictMode>
);
