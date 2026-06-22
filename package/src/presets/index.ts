import type { Options } from "#/@types/options";

import { PRESET_ES3, PRESET_ES3_MINIFIED } from "#/presets/targets/es3";
import { PRESET_ES5, PRESET_ES5_MINIFIED } from "#/presets/targets/es5";
import {
    PRESET_ES2015,
    PRESET_ES2015_MINIFIED,
} from "#/presets/targets/es2015";

type Presets = Record<"ES3" | "ES5" | "ES2015", Options>;

const presets: Presets = {
    ES3: PRESET_ES3,
    ES5: PRESET_ES5,
    ES2015: PRESET_ES2015,
};

const minifiedPresets: Presets = {
    ES3: PRESET_ES3_MINIFIED,
    ES5: PRESET_ES5_MINIFIED,
    ES2015: PRESET_ES2015_MINIFIED,
};

export type { Presets };
export { minifiedPresets, presets };
