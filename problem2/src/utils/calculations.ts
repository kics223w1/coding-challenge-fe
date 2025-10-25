export function calculateExchange(
  amount: number,
  fromRate: number,
  toRate: number
): number {
  if (amount <= 0 || fromRate <= 0 || toRate <= 0) {
    return 0
  }
  
  const result = (amount * fromRate) / toRate
  return Math.floor(result)
}

export function calculateRate(fromAmount: number, toAmount: number): number {
  if (fromAmount <= 0) {
    return 0
  }
  
  return Math.floor(toAmount / fromAmount)
}

export function isValidNumericInput(value: string): boolean {
  return value === "" || /^\d+$/.test(value)
}

