import type { JsMinifyOptions, Options as SwcOptions } from "@swc/core";
import type { Format, Partial } from "ts-vista";

type CompleteOptions = {
    transform: SwcOptions;
    minify: boolean | JsMinifyOptions;
};

type Options = Format<Partial<CompleteOptions>>;

export type { CompleteOptions, Options };
