import type { Plugin } from "rolldown";
import type { UnpluginFactory, UnpluginOptions } from "unplugin";

import type { Options } from "#/@types/options";

import { createUnplugin } from "unplugin";

import { configPlugin } from "#/plugins/config";
import { transformPlugin } from "#/plugins/transform";
import { name } from "../package.json";

const plugin = (options: Options): Plugin | Plugin[] => {
    const factory: UnpluginFactory<undefined> = (): UnpluginOptions[] => {
        return [
            ...configPlugin({
                name,
            }),
            ...transformPlugin({
                name,
                swc: options.swc,
            }),
        ];
    };

    return createUnplugin(factory).rolldown();
};

export { plugin as compat };
