import type { Output, Options as SwcOptions } from "@swc/core";
import type { HookFilter, ObjectHook, TransformPluginContext } from "rolldown";
import type { TopLevelFilterExpression } from "rolldown/filter";
import type { TransformResult, UnpluginOptions } from "unplugin";

import { transform as swcTransform } from "@swc/core";
import { toMerged } from "es-toolkit";

import { FILTER_JS } from "#/consts/filter";
import { OPTIONS_TRANSFORM_DEFAULT } from "#/consts/swc";

type TransformPluginOptions = {
    name: string;
    options?: SwcOptions;
};

const transformPlugin = ({
    name,
    options,
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
        filter: {
            id: {
                include: [
                    FILTER_JS,
                ],
            },
        },
        handler: async (code: string): Promise<TransformResult> => {
            const opts: SwcOptions = toMerged(
                OPTIONS_TRANSFORM_DEFAULT,
                options ?? {},
            );

            const result: Output = await swcTransform(code, opts);

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
