import { defineConfig } from "rolldown";
import { compat } from "unplugin-compat/rolldown";

export default defineConfig({
    input: "./src/index.ts",
    plugins: [
        compat(),
    ],
});
