/**
 * JavaScript file filter.
 *
 * Include: *.js | *.cjs | *.mjs | *.ts | *.cts | *.mts | *.jsx | *.tsx
 *
 * Exclude: *.d.ts
 */
const FILTER_JS: RegExp =
    /^(?!.*\.d\.ts$).*\.(js|cjs|mjs|ts|cts|mts|jsx|tsx)(\?.*)?(#.*)?$/;

export { FILTER_JS };
