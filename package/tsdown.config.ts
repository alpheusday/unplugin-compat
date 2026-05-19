import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            // public
            rolldown: "./src/rolldown.ts",
            vite: "./src/vite.ts",
            // internal
            "plugins/config": "./src/plugins/config.ts",
            "plugins/transform": "./src/plugins/transform.ts",
            "plugins/minify": "./src/plugins/minify.ts",
            "functions/tsconfig": "./src/functions/tsconfig.ts",
        },
        unbundle: true,
    },
    [
        esmPreset(),
        cjsPreset(),
        dtsPreset({
            presetOptions: {
                performanceMode: true,
            },
        }),
    ],
);
