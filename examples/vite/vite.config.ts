import { compat } from "unplugin-compat/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        compat(),
    ],
});
