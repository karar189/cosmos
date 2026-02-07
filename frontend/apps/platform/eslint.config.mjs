import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import i18next from "eslint-plugin-i18next";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
      "jsx-a11y": jsxA11y,
      "i18next": i18next,
      "react-hooks": reactHooks,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...jsxA11y.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "jsx-a11y/anchor-is-valid": "off",
      "i18next/no-literal-string": [
        "error",
        {
          markupOnly: true,
          onlyAttribute: [],
          ignore: [
            "alt",
            "aria-label",
            "aria-labelledby",
            "data-testid",
            "data-cy",
            "className",
            "css",
            "href",
            "src",
          ],
        },
      ],
      // Disable base eslint rules that conflict with TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",
      // Disable new stricter rules from react-hooks v7 that weren't in the old config
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
    },
  },
  prettier,
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
];
