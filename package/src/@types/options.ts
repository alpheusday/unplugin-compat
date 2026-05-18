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

type CompleteOptions = {
    /**
     * Transform options.
     *
     * By default, it is `OPTIONS_TRANSFORM_DEFAULT`.
     */
    transform: TransformOptions;
    /**
     * Minify options.
     *
     * By default, it is:
     *
     * - rolldown - `false`
     * - vite - `OPTIONS_MINIFY_DEFAULT`
     */
    minify: boolean | MinifyOptions;
};

/**
 * Options for the plugin.
 */
type Options = Format<Partial<CompleteOptions>>;

export type { CompleteOptions, MinifyOptions, Options, TransformOptions };
