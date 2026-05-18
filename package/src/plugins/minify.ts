import type { JsMinifyOptions, Output } from "@swc/core";
import type { ObjectHook } from "rolldown";
import type { UnpluginOptions } from "unplugin";

import { minify as swcMinify } from "@swc/core";
import { toMerged } from "es-toolkit";

import { OPTIONS_MINIFY_DEFAULT } from "#/consts/swc";

type MinifyPluginOptions = {
    name: string;
    options?: JsMinifyOptions;
};

const minifyPlugin = ({
    name,
    options,
}: MinifyPluginOptions): UnpluginOptions[] => {
    const renderChunk:
        | ObjectHook<
              (code: string) => Promise<{
                  code: string;
                  map?: string;
              }>,
              object
          >
        | undefined = {
        order: "post",
        handler: async (
            code: string,
        ): Promise<{
            code: string;
            map?: string;
        }> => {
            const opts: JsMinifyOptions = toMerged(
                OPTIONS_MINIFY_DEFAULT,
                options ?? {},
            );

            const result: Output = await swcMinify(code, opts);

            return {
                code: result.code,
                map: result.map,
            };
        },
    };

    return [
        {
            name: `${name}/minify`,
            rolldown: {
                renderChunk,
            },
            vite: {
                renderChunk,
            },
        },
    ];
};

export type { MinifyPluginOptions };
export { minifyPlugin };
