import type { MinifyPluginOptions } from "unplugin-compat/plugins/minify";

import { minifyPlugin } from "unplugin-compat/plugins/minify";
import { describe, expect, it } from "vitest";

type RenderChunkHook = {
    handler: (code: string) => Promise<{
        code: string;
        map?: string;
    }>;
    order: string;
};

describe("minifyPlugin", () => {
    const name: string = "test-plugin";

    describe("with default options", () => {
        const options: MinifyPluginOptions = {
            name,
        };
        const plugins = minifyPlugin(options);
        const plugin = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        it("returns an array with one plugin", () => {
            expect(plugins).toHaveLength(1);
        });

        it("sets the plugin name with /minify suffix", () => {
            expect(plugin.name).toBe(`${name}/minify`);
        });

        it("has rolldown renderChunk hook", () => {
            expect(plugin.rolldown).toBeDefined();
            expect(plugin.rolldown?.renderChunk).toBeDefined();
        });

        it("has vite renderChunk hook", () => {
            expect(plugin.vite).toBeDefined();
            expect(plugin.vite?.renderChunk).toBeDefined();
        });

        it("shares the same renderChunk hook between rolldown and vite", () => {
            expect(plugin.rolldown?.renderChunk).toBe(plugin.vite?.renderChunk);
        });

        describe("renderChunk hook", () => {
            const hook: RenderChunkHook = plugin.rolldown
                ?.renderChunk as RenderChunkHook;

            it("has order post", () => {
                expect(hook.order).toBe("post");
            });

            it("minifies code by removing whitespace", async () => {
                const input: string = "function hello() { return 1; }";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.code.length).toBeLessThan(input.length);
            });

            it("preserves code semantics after minification", async () => {
                const input: string = "function add(a, b) { return a + b; }";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.code).toContain("function");
                expect(result.code).toContain("return");
            });

            it("returns map as undefined by default", async () => {
                const input: string = "var x = 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.map).toBeUndefined();
            });
        });
    });

    describe("with compress disabled", () => {
        const options: MinifyPluginOptions = {
            name,
            options: {
                compress: false,
                mangle: false,
            },
        };
        const plugins = minifyPlugin(options);
        const plugin = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        const hook: RenderChunkHook = plugin.rolldown
            ?.renderChunk as RenderChunkHook;

        it("still removes whitespace when compress is disabled", async () => {
            const input: string = "function hello() { var x = 1; return x; }";
            const result: {
                code: string;
                map?: string;
            } = await hook.handler(input);

            expect(result.code.length).toBeLessThan(input.length);
            expect(result.code).not.toContain("  ");
        });

        it("does not mangle variable names when mangle is disabled", async () => {
            const input: string =
                "function hello() { var myVariable = 1; return myVariable; }";
            const result: {
                code: string;
                map?: string;
            } = await hook.handler(input);

            expect(result.code).toContain("myVariable");
        });
    });
});
