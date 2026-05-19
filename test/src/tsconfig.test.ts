import type { Options as SwcOptions } from "@swc/core";
import type { TsConfigJson, TsConfigResult } from "get-tsconfig";
import type { CompilerOptions } from "unplugin-compat/functions/tsconfig";

import {
    mapCompilerOptions,
    resolveCompilerOptions,
} from "unplugin-compat/functions/tsconfig";
import { describe, expect, it } from "vitest";

describe("mapCompilerOptions", (): void => {
    describe("jsx", (): void => {
        it("enables tsx for TypeScript files when jsx is set", (): void => {
            const compilerOptions: CompilerOptions = {
                jsx: "react",
            };
            const id: string = "/test/component.tsx";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.parser).toBeDefined();
            if (result.jsc?.parser) {
                const parser: typeof result.jsc.parser = result.jsc.parser;
                if ("syntax" in parser && parser.syntax === "typescript") {
                    expect(parser.tsx).toBe(true);
                }
            }
        });

        it("enables jsx for JavaScript files when jsx is set", (): void => {
            const compilerOptions: CompilerOptions = {
                jsx: "react",
            };
            const id: string = "/test/component.jsx";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.parser).toBeDefined();
            if (result.jsc?.parser) {
                const parser: typeof result.jsc.parser = result.jsc.parser;
                if ("syntax" in parser && parser.syntax === "ecmascript") {
                    expect(parser.jsx).toBe(true);
                }
            }
        });

        it("maps jsxFactory to jsc.transform.react.pragma", (): void => {
            const compilerOptions: CompilerOptions = {
                jsx: "react",
                jsxFactory: "h",
            };
            const id: string = "/test/component.tsx";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.transform?.react?.pragma).toBe("h");
        });

        it("maps jsxFragmentFactory to jsc.transform.react.pragmaFrag", (): void => {
            const compilerOptions: CompilerOptions = {
                jsx: "react",
                jsxFragmentFactory: "Fragment",
            };
            const id: string = "/test/component.tsx";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.transform?.react?.pragmaFrag).toBe("Fragment");
        });

        it("maps jsxImportSource to jsc.transform.react.importSource", (): void => {
            const compilerOptions: CompilerOptions = {
                jsx: "react-jsx",
                jsxImportSource: "react",
            };
            const id: string = "/test/component.tsx";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.transform?.react?.importSource).toBe("react");
        });

        it("does not set jsx when not in compilerOptions", (): void => {
            const compilerOptions: CompilerOptions = {};
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.parser).toBeUndefined();
            expect(result.jsc?.transform?.react).toBeUndefined();
        });
    });

    describe("experimentalDecorators", (): void => {
        it("enables decorators, keepClassNames, and legacyDecorator", (): void => {
            const compilerOptions: CompilerOptions = {
                experimentalDecorators: true,
            };
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.keepClassNames).toBe(true);
            expect(result.jsc?.transform?.legacyDecorator).toBe(true);
            if (result.jsc?.parser) {
                const parser: typeof result.jsc.parser = result.jsc.parser;
                if ("syntax" in parser && parser.syntax === "typescript") {
                    expect(parser.decorators).toBe(true);
                }
            }
        });

        it("maps emitDecoratorMetadata to decoratorMetadata", (): void => {
            const compilerOptions: CompilerOptions = {
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
            };
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.transform?.decoratorMetadata).toBe(true);
        });

        it("sets decoratorMetadata to false when emitDecoratorMetadata is false", (): void => {
            const compilerOptions: CompilerOptions = {
                experimentalDecorators: true,
                emitDecoratorMetadata: false,
            };
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.transform?.decoratorMetadata).toBe(false);
        });

        it("does not set decorator config when experimentalDecorators is absent", (): void => {
            const compilerOptions: CompilerOptions = {};
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.keepClassNames).toBeUndefined();
            expect(result.jsc?.transform?.legacyDecorator).toBeUndefined();
            expect(result.jsc?.transform?.decoratorMetadata).toBeUndefined();
        });
    });

    describe("useDefineForClassFields", (): void => {
        it("maps true to jsc.transform.useDefineForClassFields", (): void => {
            const compilerOptions: CompilerOptions = {
                useDefineForClassFields: true,
            };
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.transform?.useDefineForClassFields).toBe(true);
        });

        it("maps false to jsc.transform.useDefineForClassFields", (): void => {
            const compilerOptions: CompilerOptions = {
                useDefineForClassFields: false,
            };
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(result.jsc?.transform?.useDefineForClassFields).toBe(false);
        });

        it("does not set when absent", (): void => {
            const compilerOptions: CompilerOptions = {};
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            expect(
                result.jsc?.transform?.useDefineForClassFields,
            ).toBeUndefined();
        });
    });

    describe("irrelevant options", (): void => {
        it("ignores module, strict, paths, and other non-mapped options", (): void => {
            const compilerOptions: CompilerOptions = {
                module: "ESNext" as TsConfigJson.CompilerOptions.Module,
                strict: true,
                esModuleInterop: true,
                paths: {
                    "@/*": [
                        "src/*",
                    ],
                },
                baseUrl: ".",
            };
            const id: string = "/test/file.ts";

            const result: Partial<SwcOptions> = mapCompilerOptions({
                id,
                compilerOptions,
            });

            /**
             * No jsc fields should be set from these options.
             */
            expect(result.jsc?.parser).toBeUndefined();
            expect(result.jsc?.transform).toBeUndefined();
        });
    });
});

describe("resolveCompilerOptions", (): void => {
    it("returns empty object when tsconfigFile is false", (): void => {
        const id: string = "/test/file.ts";
        const cache: Map<string, TsConfigResult> = new Map();

        const result: CompilerOptions = resolveCompilerOptions({
            id,
            tsconfig: false,
            cache,
        });

        expect(result).toEqual({});
    });

    it("returns empty object when tsconfig is not found", (): void => {
        const id: string = "/nonexistent/path/file.ts";
        const cache: Map<string, TsConfigResult> = new Map();

        const result: CompilerOptions = resolveCompilerOptions({
            id,
            tsconfig: true,
            cache,
        });

        expect(result).toEqual({});
    });
});
