import type { UnpluginOptions } from "unplugin";
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

describe("minifyPlugin", (): void => {
    const name: string = "test-plugin";

    describe("with default options", (): void => {
        const options: MinifyPluginOptions = {
            name,
        };
        const plugins: UnpluginOptions[] = minifyPlugin(options);
        const plugin: UnpluginOptions | undefined = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        it("returns an array with one plugin", (): void => {
            expect(plugins).toHaveLength(1);
        });

        it("sets the plugin name with /minify suffix", (): void => {
            expect(plugin.name).toBe(`${name}/minify`);
        });

        it("has rolldown renderChunk hook", (): void => {
            expect(plugin.rolldown).toBeDefined();
            expect(plugin.rolldown?.renderChunk).toBeDefined();
        });

        it("has vite renderChunk hook", (): void => {
            expect(plugin.vite).toBeDefined();
            expect(plugin.vite?.renderChunk).toBeDefined();
        });

        it("shares the same renderChunk hook between rolldown and vite", (): void => {
            expect(plugin.rolldown?.renderChunk).toBe(plugin.vite?.renderChunk);
        });

        describe("renderChunk hook", (): void => {
            const hook: RenderChunkHook = plugin.rolldown
                ?.renderChunk as RenderChunkHook;

            it("has order post", (): void => {
                expect(hook.order).toBe("post");
            });

            it("minifies code by removing whitespace", async (): Promise<void> => {
                const input: string = "function hello() { return 1; }";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.code.length).toBeLessThan(input.length);
            });

            it("preserves code semantics after minification", async (): Promise<void> => {
                const input: string = "function add(a, b) { return a + b; }";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.code).toContain("function");
                expect(result.code).toContain("return");
            });

            it("returns source map by default", async (): Promise<void> => {
                const input: string = "var x = 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.map).toBeDefined();
                expect(result.map).toBeTypeOf("string");
            });
        });
    });

    describe("with compress disabled", (): void => {
        const options: MinifyPluginOptions = {
            name,
            options: {
                compress: false,
                mangle: false,
            },
        };
        const plugins: UnpluginOptions[] = minifyPlugin(options);
        const plugin: UnpluginOptions | undefined = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        const hook: RenderChunkHook = plugin.rolldown
            ?.renderChunk as RenderChunkHook;

        it("still removes whitespace when compress is disabled", async (): Promise<void> => {
            const input: string = "function hello() { var x = 1; return x; }";
            const result: {
                code: string;
                map?: string;
            } = await hook.handler(input);

            expect(result.code.length).toBeLessThan(input.length);
            expect(result.code).not.toContain("  ");
        });

        it("does not mangle variable names when mangle is disabled", async (): Promise<void> => {
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
