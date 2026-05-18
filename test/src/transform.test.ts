import type { TransformPluginOptions } from "unplugin-compat/plugins/transform";

import { transformPlugin } from "unplugin-compat/plugins/transform";
import { describe, expect, it } from "vitest";

type TransformHook = {
    handler: (code: string) => Promise<{
        code: string;
        map?: string;
    }>;
    order: string;
};

describe("transformPlugin", () => {
    const name: string = "test-plugin";

    describe("with default options", () => {
        const options: TransformPluginOptions = {
            name,
        };
        const plugins = transformPlugin(options);
        const plugin = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        it("returns an array with one plugin", () => {
            expect(plugins).toHaveLength(1);
        });

        it("sets the plugin name with /transform suffix", () => {
            expect(plugin.name).toBe(`${name}/transform`);
        });

        it("has rolldown transform hook", () => {
            expect(plugin.rolldown).toBeDefined();
            expect(plugin.rolldown?.transform).toBeDefined();
        });

        it("has vite transform hook", () => {
            expect(plugin.vite).toBeDefined();
            expect(plugin.vite?.transform).toBeDefined();
        });

        it("shares the same transform hook between rolldown and vite", () => {
            expect(plugin.rolldown?.transform).toBe(plugin.vite?.transform);
        });

        describe("transform hook", () => {
            const hook: TransformHook = plugin.rolldown
                ?.transform as TransformHook;

            it("has order pre", () => {
                expect(hook.order).toBe("pre");
            });

            it("downlevels arrow functions to function expressions", async () => {
                const input: string = "const fn = () => 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.code).toContain("function");
                expect(result.code).toContain("return");
                expect(result.code).not.toContain("=>");
            });

            it("downlevels const to var", async () => {
                const input: string = "const x = 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.code).toContain("var");
                expect(result.code).not.toContain("const ");
            });

            it("downlevels template literals to string concatenation", async () => {
                // biome-ignore lint/suspicious/noTemplateCurlyInString: test input contains JS template literal interpolation
                const input: string = "const greet = `Hello ${name}!`;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.code).toContain("concat");
            });

            it("returns undefined map by default", async () => {
                const input: string = "const x = 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input);

                expect(result.map).toBeUndefined();
            });
        });
    });

    describe("with custom options", () => {
        const options: TransformPluginOptions = {
            name,
            options: {
                jsc: {
                    target: "es2015",
                },
            },
        };
        const plugins = transformPlugin(options);
        const plugin = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        const hook: TransformHook = plugin.rolldown?.transform as TransformHook;

        it("does not downlevel arrow functions when target is es2015", async () => {
            const input: string = "const fn = () => 1;";
            const result: {
                code: string;
                map?: string;
            } = await hook.handler(input);

            expect(result.code).toContain("=>");
        });

        it("does not downlevel const when target is es2015", async () => {
            const input: string = "const x = 1;";
            const result: {
                code: string;
                map?: string;
            } = await hook.handler(input);

            expect(result.code).toContain("const ");
        });
    });
});
