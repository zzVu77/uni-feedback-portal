module.exports = {
  "backend/**/*.{ts,tsx}": () => "npm run type-check --workspace=backend",
  "frontend/**/*.{ts,tsx}": () => "npm run type-check --workspace=frontend",
  "backend/**/*.{ts,tsx,js,jsx,json,css,scss}": [
    "prettier --write",
    "eslint --fix --config backend/eslint.config.mjs",
  ],
  "frontend/**/*.{ts,tsx,js,jsx,json,css,scss}": [
    "prettier --write",
    "eslint --fix --config frontend/eslint.config.mjs",
  ],
};
