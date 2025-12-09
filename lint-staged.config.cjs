module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{css,md,json,html}': ['prettier --write'],
  'src/**/*.{ts,tsx}': ['vitest related --run'],
}
