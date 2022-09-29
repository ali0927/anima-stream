const IS_PRODUCTION_BUILD = Boolean(process.env.NODE_ENV === "production");

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:jsx-a11y/strict",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "jsx-a11y", "@typescript-eslint", "prettier"],
  rules: {
    "no-unused-vars": IS_PRODUCTION_BUILD ? "error" : "off",
    "@typescript-eslint/no-unused-vars": IS_PRODUCTION_BUILD ? "error" : "off",
    "no-debugger": IS_PRODUCTION_BUILD ? "error" : "off",
    "no-console": "off", // mb will be replaced by sentry etc. later
    "no-undef": "off",
    "react-hooks/exhaustive-deps": "error",
    "no-var": "error",
    "brace-style": "error",
    "prefer-template": "error",
    radix: "error",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
  overrides: [
    {
      files: [
        "**/*.test.js",
        "**/*.test.jsx",
        "**/*.test.tsx",
        "**/*.spec.js",
        "**/*.spec.jsx",
        "**/*.spec.tsx",
      ],
      env: {
        jest: true,
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
