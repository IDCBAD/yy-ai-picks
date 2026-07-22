import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    ".next/**",
    ".next-e2e/**",
    ".open-next/**",
    ".wrangler/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "reference/**",
    "yy-ai-picks/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
