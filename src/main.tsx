import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Providers } from "./app/provider"
import App from "./app/App"
import AuthInitializer from "./features/auth/AuthInitializer"
import "@/index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
)