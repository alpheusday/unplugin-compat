import type { Output, Options as SwcOptions } from "@swc/core";
import type { HookFilter, ObjectHook, TransformPluginContext } from "rolldown";
import type { TopLevelFilterExpression } from "rolldown/filter";
import type { TransformResult, UnpluginOptions } from "unplugin";

import { transform as swcTransform } from "@swc/core";
import { toMerged } from "es-toolkit";

import { OPTIONS_TRANSFORM_DEFAULT } from "#/consts/swc";

type TransformPluginOptions = {
    name: string;
    swc?: SwcOptions;
};

const transformPlugin = ({
    name,
    swc,
}: TransformPluginOptions): UnpluginOptions[] => {
    const transform:
        | ObjectHook<
              (
                  this: TransformPluginContext,
                  code: string,
                  id: string,
              ) => TransformResult | Promise<TransformResult>,
              {
                  filter?: HookFilter | TopLevelFilterExpression[];
              }
          >
        | undefined = {
        order: "pre",
        handler: async (code: string): Promise<TransformResult> => {
            const options: SwcOptions = toMerged(
                OPTIONS_TRANSFORM_DEFAULT,
                swc ?? {},
            );

            const result: Output = await swcTransform(code, options);

            return {
                code: result.code,
                map: result.map,
            };
        },
    };

    return [
        {
            name: `${name}/transform`,
            rolldown: {
                transform,
            },
            vite: {
                // @ts-expect-error
                transform,
            },
        },
    ];
};

export type { TransformPluginOptions };
export { transformPlugin };
