module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "prettier"
  ],
  plugins: [
    "import",
    "prettier"
  ],
  rules: {
    "import/extensions": "off",
    "no-console": "off"
  }
};