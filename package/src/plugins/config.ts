import type { MinimalPluginContext, ObjectHook, OutputOptions } from "rolldown";
import type { UnpluginOptions } from "unplugin";

import { toMerged } from "es-toolkit";

type configPluginOptions = {
    name: string;
};

const configPlugin = ({ name }: configPluginOptions): UnpluginOptions[] => {
    const outputOptions:
        | ObjectHook<
              (
                  this: MinimalPluginContext,
                  options: OutputOptions,
              ) => OutputOptions,
              object
          >
        | undefined = {
        order: "post",
        handler: (options: OutputOptions): OutputOptions => {
            return toMerged(options, {
                minify: false,
            } satisfies OutputOptions);
        },
    };

    return [
        {
            name: `${name}/config`,
            rolldown: {
                outputOptions,
            },
            vite: {
                outputOptions,
            },
        },
    ];
};

export type { configPluginOptions };
export { configPlugin };
