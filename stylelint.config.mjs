/** @type {import('stylelint').Config} */
export default {
    extends: ["stylelint-config-standard"],
    rules: {
        "custom-property-pattern": "^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",

        "color-function-notation": null,
        "color-function-alias-notation": null,
        "color-hex-length": null,

        "selector-max-id": null,

        "unit-allowed-list": [
            "rem",
            "px",
            "%",
            "vh",
            "vw",
            "em",
            "deg",
            "s",
            "ms",
            "fr",
        ],

        "alpha-value-notation": null,

        "keyframes-name-pattern": "^[a-z][a-z0-9-]*$",

        "font-family-name-quotes": null,

        "property-no-deprecated": null,
        "declaration-property-value-keyword-no-deprecated": null,

        "property-no-vendor-prefix": null,

        "no-descending-specificity": null,

        "no-duplicate-selectors": null,

        "media-feature-range-notation": null,
    },
    ignoreFiles: ["node_modules/**", "dist/**", "build/**"],
};
