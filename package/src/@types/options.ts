import type { JsMinifyOptions, Options as SwcOptions } from "@swc/core";
import type { Format, Omit, Partial } from "ts-vista";

type TransformOptions = Omit<SwcOptions, "minify">;

type MinifyOptions = JsMinifyOptions;

type CompleteOptions = {
    transform: TransformOptions;
    minify: boolean | MinifyOptions;
};

type Options = Format<Partial<CompleteOptions>>;

export type { CompleteOptions, MinifyOptions, Options, TransformOptions };
