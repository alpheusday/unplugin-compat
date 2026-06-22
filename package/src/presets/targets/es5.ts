import type {
    MinifyOptions,
    Options,
    TransformOptions,
} from "#/@types/options";

import { PRESET_ES3_MINIFY, PRESET_ES3_TRANSFORM } from "#/presets/targets/es3";

const PRESET_ES5_TRANSFORM: TransformOptions = {
    ...PRESET_ES3_TRANSFORM,
    jsc: {
        ...PRESET_ES3_TRANSFORM.jsc,
        target: "es5",
    },
};

const PRESET_ES5_MINIFY: MinifyOptions = {
    ...PRESET_ES3_MINIFY,
    ecma: 5,
    safari10: false,
};

const PRESET_ES5: Options = {
    transform: PRESET_ES5_TRANSFORM,
    minify: false,
};

const PRESET_ES5_MINIFIED: Options = {
    transform: PRESET_ES5_TRANSFORM,
    minify: PRESET_ES5_MINIFY,
};

export {
    PRESET_ES5,
    PRESET_ES5_MINIFIED,
    PRESET_ES5_MINIFY,
    PRESET_ES5_TRANSFORM,
};
