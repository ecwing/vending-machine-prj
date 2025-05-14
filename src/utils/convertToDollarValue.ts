export function formatAmount(total: number) {
  if (total < 100) return `${total}¢`;
  const dollarAmount = (total / 100).toFixed(2);
  return `$${dollarAmount}`;
}
