# Unplugin Compat

A plugin for downleveling compatibility.

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

## License

This project is licensed under the terms of the MIT license.
