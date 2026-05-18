import type {
    JsMinifyOptions as MinifyOptions,
    Options as TransformOptions,
} from "@swc/core";

const OPTIONS_TRANSFORM_DEFAULT = {
    jsc: {
        parser: {
            syntax: "typescript",
            tsx: true,
            decorators: true,
        },
        target: "es3",
        keepClassNames: true,
        preserveAllComments: true,
    },
    minify: false,
    sourceMaps: true,
} as const satisfies TransformOptions;

const OPTIONS_MINIFY_DEFAULT = {
    compress: true,
    mangle: true,
    ecma: 3,
    keep_classnames: false,
    keep_fnames: false,
    module: "unknown",
    safari10: true,
    sourceMap: true,
} as const satisfies MinifyOptions;

export { OPTIONS_MINIFY_DEFAULT, OPTIONS_TRANSFORM_DEFAULT };
