export default {
  '*.ts[x]': ['eslint --fix --max-warnings=0', 'prettier --write'],
  '*.{css,md,json,html}': ['prettier --write'],
  'src/**/*.ts[x]': ['vitest related --run'],
}
