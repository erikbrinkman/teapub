import eslint from "@eslint/js";
import spellcheck from "eslint-plugin-spellcheck";
import tsdoc from "eslint-plugin-tsdoc";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      spellcheck,
      tsdoc,
    },
    rules: {
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],
      "no-warning-comments": [
        "error",
        {
          terms: ["fixme"],
          location: "anywhere",
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "tsdoc/syntax": "error",
      "spellcheck/spell-checker": [
        "error",
        {
          identifiers: false,
          minLength: 4,
          skipWords: [
            "epub",
            "iframe",
            "xhtml",
            "oebps",
            "xlmns",
            "jpeg",
            "href",
          ],
        },
      ],
    },
  },
);
