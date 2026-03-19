/** @type {import('dependency-cruiser').IConfiguration} */
const path = require("path");
const depCruiserConfigDir = path.join(
    __dirname,
    "node_modules/dependency-cruiser/configs",
);

const noCircular = require(path.join(depCruiserConfigDir, "rules/no-circular.cjs"));
const noDeprecatedCore = require(path.join(
    depCruiserConfigDir,
    "rules/no-deprecated-core.cjs",
));
const noDuplicateDependencyTypes = require(path.join(
    depCruiserConfigDir,
    "rules/no-duplicate-dependency-types.cjs",
));
const noNonPackageJson = require(path.join(
    depCruiserConfigDir,
    "rules/no-non-package-json.cjs",
));
const noOrphans = require(path.join(depCruiserConfigDir, "rules/no-orphans.cjs"));
const notToDeprecated = require(path.join(
    depCruiserConfigDir,
    "rules/not-to-deprecated.cjs",
));
const notToUnresolvable = require(path.join(
    depCruiserConfigDir,
    "rules/not-to-unresolvable.cjs",
));

// Extend no-orphans with Nbamon-specific exceptions
const NBAMON_ORPHAN_EXCEPTIONS =
    "|themeInit\\.js$" +
    "|(^|/)eslint\\.config\\.(?:js|cjs|mjs)$" +
    "|(^|/)vitest\\.config\\.(?:js|cjs|mjs|ts)$" +
    "|(^|/)stylelint\\.config\\.(?:js|cjs|mjs)$";
const noOrphansNbamon = {
    ...noOrphans,
    from: {
        ...noOrphans.from,
        pathNot: noOrphans.from.pathNot + NBAMON_ORPHAN_EXCEPTIONS,
    },
};

module.exports = {
    forbidden: [
        noOrphansNbamon,
        noCircular,
        noDeprecatedCore,
        noDuplicateDependencyTypes,
        noNonPackageJson,
        notToDeprecated,
        notToUnresolvable,
        // Nbamon: production code must not depend on test code
        {
            name: "no-production-to-test",
            severity: "error",
            comment:
                "Production code must not import from test files. Tests depend on source, not the other way around.",
            from: { pathNot: "^tests/" },
            to: { path: "^tests/" },
        },
        // Nbamon: server must not depend on client code
        {
            name: "no-server-to-client",
            severity: "error",
            comment:
                "Server (index.js) must not import from public/ client code. They run in different environments.",
            from: { path: "index\\.js$" },
            to: { path: "^public/" },
        },
        // Nbamon: client must not depend on server modules (exclude node_modules)
        {
            name: "no-client-to-server",
            severity: "error",
            comment:
                "Client code must not import server modules. Use fetch/API for communication.",
            from: { path: "^public/" },
            to: {
                path: "index\\.js$",
                pathNot: "node_modules",
            },
        },
    ],
    options: {
        doNotFollow: {
            path: "node_modules",
            dependencyTypes: [
                "npm",
                "npm-dev",
                "npm-optional",
                "npm-peer",
                "npm-bundled",
                "npm-no-pkg",
            ],
        },
        // Focus on application source; config files validated but not deeply traversed
        includeOnly: {
            path: [
                "index\\.js$",
                "public/",
                "tests/",
                "eslint\\.config\\.",
                "vitest\\.config\\.",
                "stylelint\\.config\\.",
            ],
        },
        // Support both CommonJS (index.js) and ES modules (public/, tests/)
        moduleSystems: ["cjs", "es6"],
    },
};
