import type { JsMinifyOptions, Options as SwcOptions } from "@swc/core";
import type { Format, Omit, Partial } from "ts-vista";

/**
 * Transform options.
 */
type TransformOptions = Omit<SwcOptions, "minify">;

/**
 * Minify options.
 */
type MinifyOptions = JsMinifyOptions;

/**
 * Tsconfig type.
 */
type TsConfig = boolean | string | undefined;

type CompleteOptions = {
    /**
     * Transform options.
     *
     * By default, it is `OPTIONS_TRANSFORM_DEFAULT`.
     */
    transform: boolean | TransformOptions;
    /**
     * Minify options.
     *
     * By default, it is:
     *
     * - rolldown - `false`
     * - vite - `OPTIONS_MINIFY_DEFAULT`
     */
    minify: boolean | MinifyOptions;
    /**
     * Resolve `compilerOptions` from tsconfig and
     * map them to `transform` options automatically.
     *
     * - `true` / `undefined` — resolve `./tsconfig.json` automatically.
     * - `false` - skip tsconfig resolution.
     * - `string` — use a specific tsconfig file name.
     *
     * Options merging based on the following priority:
     *
     * - `OPTIONS_TRANSFORM_DEFAULT` > `tsconfig.json` > `user options`
     *
     * By default, it is `undefined`.
     */
    tsconfig: TsConfig;
};

/**
 * Options for the plugin.
 */
type Options = Format<Partial<CompleteOptions>>;

export type {
    CompleteOptions,
    MinifyOptions,
    Options,
    TransformOptions,
    TsConfig,
};
