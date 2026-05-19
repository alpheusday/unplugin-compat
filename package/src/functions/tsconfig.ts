import type {
    EsParserConfig,
    JscConfig,
    Options as TransformOptions,
    TsParserConfig,
} from "@swc/core";
import type { TsConfigJson, TsConfigResult } from "get-tsconfig";

import type { TsConfig } from "#/@types/options";

import { toMerged } from "es-toolkit";
import { getTsconfig } from "get-tsconfig";

type CompilerOptions = NonNullable<TsConfigJson["compilerOptions"]>;

type ResolveCompilerOptionsOptions = {
    id: string;
    tsconfig: TsConfig;
    cache: Map<string, TsConfigResult>;
};

/**
 * Resolve `compilerOptions` from tsconfig.
 */
const resolveCompilerOptions = ({
    id,
    tsconfig,
    cache,
}: ResolveCompilerOptionsOptions): CompilerOptions => {
    if (tsconfig === false) return {};

    const configName: string | undefined =
        tsconfig === true || tsconfig === void 0 ? void 0 : tsconfig;

    const result: TsConfigResult | null = getTsconfig(
        id,
        configName,
        cache,
        true,
    );

    return result?.config.compilerOptions ?? {};
};

type MapCompilerOptionsOptions = {
    id: string;
    compilerOptions: CompilerOptions;
};

/**
 * Map tsconfig `compilerOptions` to SWC `jsc` options.
 */
const mapCompilerOptions = ({
    id,
    compilerOptions,
}: MapCompilerOptionsOptions): Partial<TransformOptions> => {
    const isTs: boolean = /\.m?tsx?$/.test(id);

    const jsc: JscConfig = {};

    /**
     * `compilerOptions.jsx` -> `jsc.parser.jsx`/`jsc.parser.tsx`
     * `compilerOptions.jsxFactory` -> `jsc.transform.react.pragma`
     * `compilerOptions.jsxFragmentFactory` -> `jsc.transform.react.pragmaFrag`
     * `compilerOptions.jsxImportSource` -> `jsc.transform.react.importSource`
     */
    if (compilerOptions.jsx) {
        if (isTs) {
            const parser: TsParserConfig = {
                syntax: "typescript",
                tsx: true,
            };

            jsc.parser = jsc.parser ? toMerged(jsc.parser, parser) : parser;
        } else {
            const parser: EsParserConfig = {
                syntax: "ecmascript",
                jsx: true,
            };

            jsc.parser = jsc.parser ? toMerged(jsc.parser, parser) : parser;
        }

        const transform: JscConfig["transform"] = {
            react: {
                pragma: compilerOptions.jsxFactory,
                pragmaFrag: compilerOptions.jsxFragmentFactory,
                importSource: compilerOptions.jsxImportSource,
            },
        };

        jsc.transform = jsc.transform
            ? toMerged(jsc.transform, transform)
            : transform;
    }

    /**
     * `compilerOptions.experimentalDecorators` ->
     *     `jsc.parser.decorators` + `jsc.keepClassNames` + `jsc.transform.legacyDecorator`
     * `compilerOptions.emitDecoratorMetadata` -> `jsc.transform.decoratorMetadata`
     */
    if (compilerOptions.experimentalDecorators) {
        if (isTs) {
            const parser: TsParserConfig = {
                syntax: "typescript",
                decorators: true,
            };

            jsc.parser = jsc.parser ? toMerged(jsc.parser, parser) : parser;
        } else {
            const parser: EsParserConfig = {
                syntax: "ecmascript",
                decorators: true,
            };

            jsc.parser = jsc.parser ? toMerged(jsc.parser, parser) : parser;
        }

        /**
         * Class name is required by type-graphql
         * to generate correct GraphQL type.
         */
        jsc.keepClassNames = true;

        const transform: JscConfig["transform"] = {
            legacyDecorator: true,
            decoratorMetadata: compilerOptions.emitDecoratorMetadata,
        };

        jsc.transform = jsc.transform
            ? toMerged(jsc.transform, transform)
            : transform;
    }

    /**
     * `compilerOptions.useDefineForClassFields` -> `jsc.transform.useDefineForClassFields`
     *
     * Use `!= null` check to allow `false` to pass through.
     */
    if (compilerOptions.useDefineForClassFields != null) {
        const transform: JscConfig["transform"] = {
            useDefineForClassFields: compilerOptions.useDefineForClassFields,
        };

        jsc.transform = jsc.transform
            ? toMerged(jsc.transform, transform)
            : transform;
    }

    return {
        jsc,
    };
};

export type { CompilerOptions, TsConfig };
export { mapCompilerOptions, resolveCompilerOptions };
