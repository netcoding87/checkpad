export type ToCommercialOptions = {
  currency?: string
  locale?: string
  decimals?: number
}

// Formats numbers for display with two decimals and optional currency.
// Defaults: locale 'de-DE', currency 'EUR', 2 decimals.
export function toCommercial(value: number, options: ToCommercialOptions = {}) {
  const { currency = 'EUR', locale = 'de-DE', decimals = 2 } = options

  if (Number.isNaN(value)) return '-'

  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}
