import ReactDOM from "react-dom/client"
import App from "./app.tsx"
import "@/styles/globals.css"
const rootElement=document.getElementById("root")
if(!rootElement) throw new Error("Root element not found")
const root=ReactDOM.createRoot(rootElement)

root.render(<App/>)
