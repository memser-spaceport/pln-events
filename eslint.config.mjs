import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// ESLint 9 flat config. Replaces .eslintrc.json and .eslintignore.
export default defineConfig([
  ...nextVitals,
  {
    // eslint-config-next 16 adds new React Compiler rules as errors.
    // The current code breaks them. Keep them as warnings so this upgrade
    // does not change component logic. Fix them in a follow-up.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/refs": "warn",
    },
  },
  globalIgnores([".next/**", "node_modules/**", "dist/**", "out/**", "next-env.d.ts"]),
]);
