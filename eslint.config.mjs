import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            indent: ["error", 4, { SwitchCase: 1 }],
            "no-unused-vars": "warn",
            "no-undef": "error",
        },
    },
    {
        files: ["public/**/*.js"],
        languageOptions: {
            sourceType: "script",
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        ignores: ["node_modules/"],
    },
];
