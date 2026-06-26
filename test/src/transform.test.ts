import type { UnpluginOptions } from "unplugin";
import type { TransformPluginOptions } from "unplugin-compat/plugins/transform";

import { transformPlugin } from "unplugin-compat/plugins/transform";
import { describe, expect, it } from "vitest";

type TransformHook = {
    handler: (
        code: string,
        id: string,
    ) => Promise<{
        code: string;
        map?: string;
    }>;
    order: string;
};

describe("transformPlugin", (): void => {
    const name: string = "test-plugin";
    const id: string = "/test/file.ts";

    describe("with default options", (): void => {
        const options: TransformPluginOptions = {
            name,
            tsconfig: false,
        };
        const plugins: UnpluginOptions[] = transformPlugin(options);
        const plugin: UnpluginOptions | undefined = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        it("returns an array with one plugin", (): void => {
            expect(plugins).toHaveLength(1);
        });

        it("sets the plugin name with /transform suffix", (): void => {
            expect(plugin.name).toBe(`${name}/transform`);
        });

        it("has rolldown transform hook", (): void => {
            expect(plugin.rolldown).toBeDefined();
            expect(plugin.rolldown?.transform).toBeDefined();
        });

        it("has vite transform hook", (): void => {
            expect(plugin.vite).toBeDefined();
            expect(plugin.vite?.transform).toBeDefined();
        });

        it("shares the same transform hook between rolldown and vite", (): void => {
            expect(plugin.rolldown?.transform).toBe(plugin.vite?.transform);
        });

        describe("transform hook", (): void => {
            const hook: TransformHook = plugin.rolldown
                ?.transform as TransformHook;

            it("has order post", (): void => {
                expect(hook.order).toBe("post");
            });

            it("downlevels arrow functions to function expressions", async (): Promise<void> => {
                const input: string = "const fn = () => 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input, id);

                expect(result.code).toContain("function");
                expect(result.code).toContain("return");
                expect(result.code).not.toContain("=>");
            });

            it("downlevels const to var", async (): Promise<void> => {
                const input: string = "const x = 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input, id);

                expect(result.code).toContain("var");
                expect(result.code).not.toContain("const ");
            });

            it("downlevels template literals to string concatenation", async (): Promise<void> => {
                // biome-ignore lint/suspicious/noTemplateCurlyInString: test input contains JS template literal interpolation
                const input: string = "const greet = `Hello ${name}!`;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input, id);

                expect(result.code).toContain("concat");
            });

            it("returns source map by default", async (): Promise<void> => {
                const input: string = "const x = 1;";
                const result: {
                    code: string;
                    map?: string;
                } = await hook.handler(input, id);

                expect(result.map).toBeDefined();
                expect(result.map).toBeTypeOf("string");
            });
        });
    });

    describe("with custom options", (): void => {
        const options: TransformPluginOptions = {
            name,
            tsconfig: false,
            options: {
                jsc: {
                    target: "es2015",
                },
            },
        };
        const plugins: UnpluginOptions[] = transformPlugin(options);
        const plugin: UnpluginOptions | undefined = plugins[0];

        if (plugin === void 0) {
            throw new Error("Plugin is undefined");
        }

        const hook: TransformHook = plugin.rolldown?.transform as TransformHook;

        it("does not downlevel arrow functions when target is es2015", async (): Promise<void> => {
            const input: string = "const fn = () => 1;";
            const result: {
                code: string;
                map?: string;
            } = await hook.handler(input, id);

            expect(result.code).toContain("=>");
        });

        it("does not downlevel const when target is es2015", async (): Promise<void> => {
            const input: string = "const x = 1;";
            const result: {
                code: string;
                map?: string;
            } = await hook.handler(input, id);

            expect(result.code).toContain("const ");
        });
    });
});
