import type { Plugin } from "rolldown";
import type { UnpluginFactory, UnpluginOptions } from "unplugin";

import type {
    MinifyOptions,
    Options,
    TransformOptions,
    TsConfig,
} from "#/@types/options";

import { createUnplugin } from "unplugin";

import { OPTIONS_TRANSFORM_DEFAULT } from "#/consts/swc";
import { configPlugin } from "#/plugins/config";
import { minifyPlugin } from "#/plugins/minify";
import { transformPlugin } from "#/plugins/transform";
import { name } from "../package.json";

/**
 * A plugin for JavaScript compatibility.
 */
const plugin = (options?: Options): Plugin | Plugin[] => {
    const factory: UnpluginFactory<undefined> = (): UnpluginOptions[] => {
        const plugins: UnpluginOptions[] = [
            ...configPlugin({
                name,
            }),
        ];

        const transform: boolean | TransformOptions =
            options?.transform ?? true;

        if (transform !== false) {
            plugins.push(
                ...transformPlugin({
                    name,
                    options:
                        typeof transform === "boolean" ? void 0 : transform,
                    tsconfig: options?.tsconfig,
                }),
            );
        }

        const minify: boolean | MinifyOptions = options?.minify ?? false;

        if (minify !== false) {
            plugins.push(
                ...minifyPlugin({
                    name,
                    options: typeof minify === "boolean" ? void 0 : minify,
                }),
            );
        }

        return plugins;
    };

    return createUnplugin(factory).rolldown();
};

export type { Presets } from "#/presets";

export { minifiedPresets, presets } from "#/presets";
export type { MinifyOptions, Options, TransformOptions, TsConfig };
export { OPTIONS_TRANSFORM_DEFAULT, plugin as compat };
