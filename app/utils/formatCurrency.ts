/**
 * Formats a number as a currency string.
 *
 * @param amount - The numeric value to format.
 * @param currency - The currency code (e.g., "USD" for US Dollar).
 * @param locale - The locale identifier (e.g., "en-US").
 * @returns The formatted currency string.
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
