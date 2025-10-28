import { defineConfig } from "wxt"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  srcDir: "src",
  vite: () => ({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  }),
})
