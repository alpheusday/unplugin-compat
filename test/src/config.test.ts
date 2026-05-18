import type { OutputOptions } from "rolldown";
import type { UnpluginOptions } from "unplugin";
import type { configPluginOptions } from "unplugin-compat/plugins/config";

import { configPlugin } from "unplugin-compat/plugins/config";
import { describe, expect, it } from "vitest";

type OutputOptionsHook = {
    handler: (options: OutputOptions) => OutputOptions;
    order: string;
};

describe("configPlugin", (): void => {
    const name: string = "test-plugin";
    const options: configPluginOptions = {
        name,
    };
    const plugins: UnpluginOptions[] = configPlugin(options);
    const plugin: UnpluginOptions | undefined = plugins[0];

    if (plugin === void 0) {
        throw new Error("Plugin is undefined");
    }

    it("returns an array with one plugin", (): void => {
        expect(plugins).toHaveLength(1);
    });

    it("sets the plugin name with /config suffix", (): void => {
        expect(plugin.name).toBe(`${name}/config`);
    });

    it("has rolldown outputOptions hook", (): void => {
        expect(plugin.rolldown).toBeDefined();
        expect(plugin.rolldown?.outputOptions).toBeDefined();
    });

    it("has vite outputOptions hook", (): void => {
        expect(plugin.vite).toBeDefined();
        expect(plugin.vite?.outputOptions).toBeDefined();
    });

    it("shares the same outputOptions hook between rolldown and vite", (): void => {
        expect(plugin.rolldown?.outputOptions).toBe(plugin.vite?.outputOptions);
    });

    describe("outputOptions hook", (): void => {
        const hook: OutputOptionsHook = plugin.rolldown
            ?.outputOptions as OutputOptionsHook;

        it("has order post", (): void => {
            expect(hook.order).toBe("post");
        });

        it("merges minify: false into output options", (): void => {
            const input: OutputOptions = {
                format: "esm",
            };
            const result: OutputOptions = hook.handler(input);

            expect(result.minify).toBe(false);
        });

        it("overrides minify: true to false", (): void => {
            const input: OutputOptions = {
                format: "esm",
                minify: true,
            };
            const result: OutputOptions = hook.handler(input);

            expect(result.minify).toBe(false);
        });

        it("preserves other output options when merging", (): void => {
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
