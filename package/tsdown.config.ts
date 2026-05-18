import { defineConfig } from "@apst/tsdown";
import { cjsPreset, dtsPreset, esmPreset } from "@apst/tsdown/presets";

export default defineConfig(
    {
        entry: {
            rolldown: "./src/rolldown.ts",
            vite: "./src/vite.ts",
            "plugins/config": "./src/plugins/config.ts",
            "plugins/transform": "./src/plugins/transform.ts",
            "plugins/minify": "./src/plugins/minify.ts",
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
