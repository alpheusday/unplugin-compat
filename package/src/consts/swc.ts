import type {
    JsMinifyOptions as MinifyOptions,
    Options as TransformOptions,
} from "@swc/core";

import { PRESET_ES5_MINIFY, PRESET_ES5_TRANSFORM } from "#/presets/targets/es5";

/**
 * Default transform options.
 */
const OPTIONS_TRANSFORM_DEFAULT: TransformOptions = {
    ...PRESET_ES5_TRANSFORM,
    minify: false,
};

/**
 * Default minify options.
 */
const OPTIONS_MINIFY_DEFAULT: MinifyOptions = {
    ...PRESET_ES5_MINIFY,
};

export { OPTIONS_MINIFY_DEFAULT, OPTIONS_TRANSFORM_DEFAULT };
