export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow longer body lines for detailed explanations
    // Keep subject line short (enforced by header-max-length: 100)
    'body-max-line-length': [2, 'always', 200],
  },
}
