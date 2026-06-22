# Unplugin Compat

A plugin for legacy environments.

[OXC](https://oxc.rs) does not support downleveling modern JavaScript syntax to ES5 and other legacy ECMAScript targets. As a result, applications built with Rolldown or Vite may not run correctly in older environments.

This plugin integrates [SWC](https://swc.rs) to transform and minify code for older ECMAScript targets. It includes several built-in presets and targets ES5 by default.

Currently, the plugin is distributed as an [unplugin](https://unplugin.unjs.io) adapter and works with both Rolldown and Vite.

## Installation

Install this package as a dependency in the project:

```sh
# npm
npm i unplugin-compat

# Yarn
yarn add unplugin-compat

# pnpm
pnpm add unplugin-compat

# Deno
deno add npm:unplugin-compat

# Bun
bun add unplugin-compat
```

## Usage

Add the plugin into the Rolldown config:

```ts
import { defineConfig } from "rolldown";
import { compat } from "unplugin-compat/rolldown";

export default defineConfig({
    input: "./src/index.ts",
    plugins: [
        compat(),
    ],
});
```

Or add the plugin into the Vite config:

```ts
import { defineConfig } from "vite";
import { compat } from "unplugin-compat/vite";

export default defineConfig({
    plugins: [
        compat(),
    ],
});
```

It is possible to use the plugin with presets:

```ts
import { defineConfig } from "rolldown";
import { compat, presets } from "unplugin-compat/rolldown";

export default defineConfig({
    input: "./src/index.ts",
    plugins: [
        compat(presets.ES2015),
    ],
});
```

Or with `minifiedPresets` in Vite:

```ts
import { defineConfig } from "vite";
import { compat, minifiedPresets } from "unplugin-compat/vite";

export default defineConfig({
    plugins: [
        compat(minifiedPresets.ES3),
    ],
});
```

## Tsconfig Binding

The following tsconfig `compilerOptions` are automatically resolved and bound to transform options:

| Compiler Options          | Transform Options                                                                |
| ------------------------- | -------------------------------------------------------------------------------- |
| `jsx`                     | `jsc.parser.jsx` / `jsc.parser.tsx`                                              |
| `jsxFactory`              | `jsc.transform.react.pragma`                                                     |
| `jsxFragmentFactory`      | `jsc.transform.react.pragmaFrag`                                                 |
| `jsxImportSource`         | `jsc.transform.react.importSource`                                               |
| `experimentalDecorators`  | `jsc.parser.decorators` + `jsc.keepClassNames` + `jsc.transform.legacyDecorator` |
| `emitDecoratorMetadata`   | `jsc.transform.decoratorMetadata`                                                |
| `useDefineForClassFields` | `jsc.transform.useDefineForClassFields`                                          |

## Contributing

For contributing, please refer to the [contributing guide](./CONTRIBUTING.md).

## License

This project is licensed under the terms of the MIT license.
