import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

const nextConfig = {
  plugins: {
    "@next/next": nextPlugin
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
    "@next/next/no-html-link-for-pages": "off"
  },
  settings: {
    next: {
      rootDir: "apps/web/"
    }
  }
};

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "**/.next/**",
      "dist/**",
      "coverage/**",
      "**/next-env.d.ts"
    ]
  },
  js.configs.recommended,
  nextConfig,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_"
        }
      ]
    }
  }
);
