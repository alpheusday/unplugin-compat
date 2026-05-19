import type { UnpluginFactory, UnpluginOptions } from "unplugin";
import type { Plugin } from "vite";

import type {
    MinifyOptions,
    Options,
    TransformOptions,
    TsConfig,
} from "#/@types/options";

import { createUnplugin } from "unplugin";

import {
    OPTIONS_MINIFY_DEFAULT,
    OPTIONS_TRANSFORM_DEFAULT,
} from "#/consts/swc";
import { configPlugin } from "#/plugins/config";
import { minifyPlugin } from "#/plugins/minify";
import { transformPlugin } from "#/plugins/transform";
import { name } from "../package.json";

/**
 * A plugin for JavaScript compatibility.
 */
const plugin = (options?: Options): Plugin | Plugin[] => {
    const factory: UnpluginFactory<undefined> = (): UnpluginOptions[] => {
        return [
            ...configPlugin({
                name,
            }),
            ...transformPlugin({
                name,
                options: options?.transform,
                tsconfig: options?.tsconfig,
            }),
            ...minifyPlugin({
                name,
                options:
                    typeof options?.minify === "boolean"
                        ? void 0
                        : options?.minify,
            }),
        ];
    };

    return createUnplugin(factory).vite();
};

export type { MinifyOptions, Options, TransformOptions, TsConfig };
export { OPTIONS_MINIFY_DEFAULT, OPTIONS_TRANSFORM_DEFAULT, plugin as compat };
