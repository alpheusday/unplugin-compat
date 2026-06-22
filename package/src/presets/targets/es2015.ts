import type {
    MinifyOptions,
    Options,
    TransformOptions,
} from "#/@types/options";

import { PRESET_ES5_MINIFY, PRESET_ES5_TRANSFORM } from "#/presets/targets/es5";

const PRESET_ES2015_TRANSFORM: TransformOptions = {
    ...PRESET_ES5_TRANSFORM,
    jsc: {
        ...PRESET_ES5_TRANSFORM.jsc,
        target: "es2015",
        keepClassNames: false,
    },
};

const PRESET_ES2015_MINIFY: MinifyOptions = {
    ...PRESET_ES5_MINIFY,
    ecma: 2015,
};

/**
 * Rolldown preset for ECMAScript 2015.
 */
const PRESET_ES2015: Options = {
    transform: PRESET_ES2015_TRANSFORM,
    minify: false,
};

/**
 * Vite preset for ECMAScript 2015.
 */
const PRESET_ES2015_MINIFIED: Options = {
    transform: PRESET_ES2015_TRANSFORM,
    minify: PRESET_ES2015_MINIFY,
};

export {
    PRESET_ES2015,
    PRESET_ES2015_MINIFIED,
    PRESET_ES2015_MINIFY,
    PRESET_ES2015_TRANSFORM,
};
