import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    loadEnv(mode, process.cwd());
    return {
        resolve: {
            alias: {
                "@": resolve(__dirname, "packages"),
            },
        },
        base: "./",
    };
});
