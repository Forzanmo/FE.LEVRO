// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Build outputs / reports that must never be linted:
    "storybook-static/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    // Vendored agent tooling, not project source.
    ".claude/**",
    // The supplied LEVRRO brand-identity microsite. Gitignored, but excluded
    // here too: if a copy is sitting in the working tree it is a separate Vite
    // app with its own conventions, and linting it reports a dozen errors
    // nobody in this repo can act on. A gate that is expected to fail stops
    // being read.
    "levrro-brand-identity-clone/**",
  ]),
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
