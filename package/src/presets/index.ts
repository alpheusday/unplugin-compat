import type { Options } from "#/@types/options";

import { PRESET_ES3, PRESET_ES3_MINIFIED } from "#/presets/targets/es3";
import { PRESET_ES5, PRESET_ES5_MINIFIED } from "#/presets/targets/es5";

type Presets = Record<"ES3" | "ES5", Options>;

const presets: Presets = {
    ES3: PRESET_ES3,
    ES5: PRESET_ES5,
};

const minifiedPresets: Presets = {
    ES3: PRESET_ES3_MINIFIED,
    ES5: PRESET_ES5_MINIFIED,
};

export type { Presets };
export { minifiedPresets, presets };
