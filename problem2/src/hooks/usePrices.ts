import { useState, useEffect } from "react"
import { Token, PriceData, ExchangeRates } from "@/types/token"
import { TOKEN_NAMES, PRICE_API_URL, DEFAULT_FROM_TOKEN, DEFAULT_TO_TOKEN } from "@/constants/tokens"

/**
 * Custom hook to fetch and manage token prices
 * @returns {Object} tokens, exchangeRates, defaultFromToken, defaultToToken, loading, error
 */
export function usePrices() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(PRICE_API_URL)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch prices: ${response.statusText}`)
        }

        const data: PriceData[] = await response.json()

        // Group by currency and get the latest price for each
        const priceMap = new Map<string, number>()
        data.forEach((item) => {
          const existing = priceMap.get(item.currency)
          // Keep the highest price for each currency
          if (!existing || existing < item.price) {
            priceMap.set(item.currency, item.price)
          }
        })

        // Convert to exchange rates object
        const rates: ExchangeRates = {}
        priceMap.forEach((price, currency) => {
          rates[currency] = price
        })
        setExchangeRates(rates)

        // Create tokens array
        const tokensArray: Token[] = Array.from(priceMap.entries())
          .map(([currency, price]) => ({
            symbol: currency,
            name: TOKEN_NAMES[currency] || currency,
            icon: `/tokens/${currency}.svg`,
            price,
          }))
          .sort((a, b) => a.symbol.localeCompare(b.symbol))

        setTokens(tokensArray)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load token prices"
        setError(errorMessage)
        console.error("Error fetching prices:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [])

  // Get default tokens
  const defaultFromToken = tokens.find((t) => t.symbol === DEFAULT_FROM_TOKEN) || null
  const defaultToToken = tokens.find((t) => t.symbol === DEFAULT_TO_TOKEN) || null

  return {
    tokens,
    exchangeRates,
    defaultFromToken,
    defaultToToken,
    loading,
    error,
  }
}

