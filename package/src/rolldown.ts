import type { Plugin } from "rolldown";
import type { UnpluginFactory, UnpluginOptions } from "unplugin";

import type {
    MinifyOptions,
    Options,
    TransformOptions,
} from "#/@types/options";

import { createUnplugin } from "unplugin";

import { configPlugin } from "#/plugins/config";
import { minifyPlugin } from "#/plugins/minify";
import { transformPlugin } from "#/plugins/transform";
import { name } from "../package.json";

const plugin = (options?: Options): Plugin | Plugin[] => {
    const factory: UnpluginFactory<undefined> = (): UnpluginOptions[] => {
        const plugins: UnpluginOptions[] = [
            ...configPlugin({
                name,
            }),
            ...transformPlugin({
                name,
                options: options?.transform,
            }),
        ];

        if (options?.minify !== void 0) {
            plugins.push(
                ...minifyPlugin({
                    name,
                    options:
                        typeof options.minify === "boolean"
                            ? void 0
                            : options.minify,
                }),
            );
        }

        return plugins;
    };

    return createUnplugin(factory).rolldown();
};

export type { MinifyOptions, Options, TransformOptions };
export { plugin as compat };
