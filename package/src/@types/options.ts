import type { Options as SwcOptions } from "@swc/core";
import type { Format, Partial } from "ts-vista";

type CompleteOptions = {
    swc: SwcOptions;
};

type Options = Format<Partial<CompleteOptions>>;

export type { CompleteOptions, Options };
