import type {
    MinifyOptions,
    Options,
    TransformOptions,
} from "#/@types/options";

const PRESET_ES3_TRANSFORM: TransformOptions = {
    jsc: {
        parser: {
            syntax: "typescript",
            tsx: true,
            decorators: true,
        },
        target: "es3",
        loose: false,
        keepClassNames: true,
        preserveAllComments: true,
    },
    sourceMaps: true,
};

const PRESET_ES3_MINIFY: MinifyOptions = {
    compress: true,
    mangle: true,
    ecma: 3,
    keep_classnames: false,
    keep_fnames: false,
    module: "unknown",
    safari10: true,
    sourceMap: true,
};

const PRESET_ES3: Options = {
    transform: PRESET_ES3_TRANSFORM,
    minify: false,
};

const PRESET_ES3_MINIFIED: Options = {
    transform: PRESET_ES3_TRANSFORM,
    minify: PRESET_ES3_MINIFY,
};

export {
    PRESET_ES3,
    PRESET_ES3_MINIFIED,
    PRESET_ES3_MINIFY,
    PRESET_ES3_TRANSFORM,
};
