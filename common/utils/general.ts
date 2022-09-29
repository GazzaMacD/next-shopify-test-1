export function currency({ price, code }: { price: string; code: string }) {
  return new Intl.NumberFormat(`en`, {
    style: `currency`,
    currency: code,
  }).format(Number(price));
}
