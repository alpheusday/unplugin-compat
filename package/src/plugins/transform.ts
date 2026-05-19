import type { Output, Options as TransformOptions } from "@swc/core";
import type { TsConfigResult } from "get-tsconfig";
import type { HookFilter, ObjectHook, TransformPluginContext } from "rolldown";
import type { TopLevelFilterExpression } from "rolldown/filter";
import type { TransformResult, UnpluginOptions } from "unplugin";

import type { CompilerOptions, TsConfig } from "#/functions/tsconfig";

import { transform as swcTransform } from "@swc/core";
import { toMerged } from "es-toolkit";

import { FILTER_JS } from "#/consts/filter";
import { OPTIONS_TRANSFORM_DEFAULT } from "#/consts/swc";
import {
    mapCompilerOptions,
    resolveCompilerOptions,
} from "#/functions/tsconfig";

type TransformPluginOptions = {
    name: string;
    options?: TransformOptions;
    tsconfig?: TsConfig;
};

const transformPlugin = ({
    name,
    options,
    tsconfig,
}: TransformPluginOptions): UnpluginOptions[] => {
    const cache: Map<string, TsConfigResult> = new Map();

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
        handler: async (code: string, id: string): Promise<TransformResult> => {
            const compilerOptions: CompilerOptions = resolveCompilerOptions({
                id,
                tsconfig,
                cache,
            });

            const tsconfigDerived: Partial<TransformOptions> =
                mapCompilerOptions({
                    id,
                    compilerOptions,
                });

            const merged: TransformOptions = toMerged(
                toMerged(OPTIONS_TRANSFORM_DEFAULT, tsconfigDerived),
                options ?? {},
            );

            /**
             * SWC does not allow `env` and `jsc.target` together,
             * when `env` is provided, clear `jsc.target` to avoid the conflict.
             */
            if (merged.env) {
                if (merged.jsc) {
                    merged.jsc.target = void 0;
                }
            }

            const opts: TransformOptions = merged;

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
