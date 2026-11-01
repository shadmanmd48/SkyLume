export default [
  {
    files: ["client/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  }
];
