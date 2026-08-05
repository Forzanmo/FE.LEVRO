/** "1,240" */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en').format(value)
}

/** "68%" (rounded). */
export function formatPercent(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat('en', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100)
}

/** "1.2k" */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  )
}
