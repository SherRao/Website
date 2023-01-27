/* eslint-disable */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/"),
            "@assets": path.resolve(__dirname, "src/assets/"),
            "@components": path.resolve(__dirname, "src/components/"),
            "@pages": path.resolve(__dirname, "src/pages/"),
            "@utils": path.resolve(__dirname, "src/utils/"),
            "@hooks": path.resolve(__dirname, "src/utils/hooks/"),
            "@constants": path.resolve(__dirname, "src/utils/constants/"),
            "@notifications": path.resolve(__dirname, "src/utils/notifications"),
        }
    }
});
