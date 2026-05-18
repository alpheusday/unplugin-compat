import type { OutputOptions } from "rolldown";
import type { configPluginOptions } from "unplugin-compat/plugins/config";

import { configPlugin } from "unplugin-compat/plugins/config";
import { describe, expect, it } from "vitest";

type OutputOptionsHook = {
    handler: (options: OutputOptions) => OutputOptions;
    order: string;
};

describe("configPlugin", () => {
    const name: string = "test-plugin";
    const options: configPluginOptions = {
        name,
    };
    const plugins = configPlugin(options);
    const plugin = plugins[0];

    if (plugin === void 0) {
        throw new Error("Plugin is undefined");
    }

    it("returns an array with one plugin", () => {
        expect(plugins).toHaveLength(1);
    });

    it("sets the plugin name with /config suffix", () => {
        expect(plugin.name).toBe(`${name}/config`);
    });

    it("has rolldown outputOptions hook", () => {
        expect(plugin.rolldown).toBeDefined();
        expect(plugin.rolldown?.outputOptions).toBeDefined();
    });

    it("has vite outputOptions hook", () => {
        expect(plugin.vite).toBeDefined();
        expect(plugin.vite?.outputOptions).toBeDefined();
    });

    it("shares the same outputOptions hook between rolldown and vite", () => {
        expect(plugin.rolldown?.outputOptions).toBe(plugin.vite?.outputOptions);
    });

    describe("outputOptions hook", () => {
        const hook: OutputOptionsHook = plugin.rolldown
            ?.outputOptions as OutputOptionsHook;

        it("has order post", () => {
            expect(hook.order).toBe("post");
        });

        it("merges minify: false into output options", () => {
            const input: OutputOptions = {
                format: "esm",
            };
            const result: OutputOptions = hook.handler(input);

            expect(result.minify).toBe(false);
        });

        it("overrides minify: true to false", () => {
            const input: OutputOptions = {
                format: "esm",
                minify: true,
            };
            const result: OutputOptions = hook.handler(input);

            expect(result.minify).toBe(false);
        });

        it("preserves other output options when merging", () => {
            const input: OutputOptions = {
                format: "esm",
                sourcemap: true,
            };
            const result: OutputOptions = hook.handler(input);

            expect(result.format).toBe("esm");
            expect(result.sourcemap).toBe(true);
            expect(result.minify).toBe(false);
        });
    });
});
