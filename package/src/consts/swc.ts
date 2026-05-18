import type { JsMinifyOptions, Options } from "@swc/core";

const OPTIONS_TRANSFORM_DEFAULT = {
    jsc: {
        target: "es5",
        parser: {
            syntax: "typescript",
            tsx: true,
            decorators: true,
        },
    },
    minify: false,
} as const satisfies Options;

const OPTIONS_MINIFY_DEFAULT = {
    compress: true,
    mangle: true,
    ecma: 5,
    module: "unknown",
} as const satisfies JsMinifyOptions;

export { OPTIONS_MINIFY_DEFAULT, OPTIONS_TRANSFORM_DEFAULT };
