import globals from "globals";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

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
            "no-unused-vars": "warn",
            "no-undef": "error",
        },
    },
    {
        files: ["public/**/*.js"],
        languageOptions: {
            sourceType: "module",
            ecmaVersion: 2022,
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        ignores: ["node_modules/"],
    },
    eslintConfigPrettier,
];
