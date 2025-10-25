import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowDown } from "lucide-react"
import { Token } from "@/types/token"
import { usePrices } from "@/hooks/usePrices"
import { calculateExchange, calculateRate, isValidNumericInput } from "@/utils/calculations"
import {
  CALCULATION_DEBOUNCE_MS,
  SWAP_DURATION_MS,
  SUCCESS_NOTIFICATION_DURATION_MS,
  DEFAULT_SLIPPAGE,
} from "@/constants/config"
import { DEFAULT_AMOUNT } from "@/constants/tokens"
import { TokenSelectModal } from "@/components/TokenSelectModal"
import { SuccessNotification } from "@/components/SuccessNotification"
import { TokenSelector } from "@/components/TokenSelector"


export function CurrencySwapForm() {
  // Fetch token prices and exchange rates
  const { tokens, exchangeRates, defaultFromToken, defaultToToken, loading, error } = usePrices()

  // Token selection state
  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)

  // Amount state
  const [fromAmount, setFromAmount] = useState(DEFAULT_AMOUNT)
  const [toAmount, setToAmount] = useState("")

  // UI state
  const [isFromModalOpen, setIsFromModalOpen] = useState(false)
  const [isToModalOpen, setIsToModalOpen] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Refs for cleanup
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set default tokens when data loads
  useEffect(() => {
    if (defaultFromToken && !fromToken) {
      setFromToken(defaultFromToken)
    }
    if (defaultToToken && !toToken) {
      setToToken(defaultToToken)
    }
  }, [defaultFromToken, defaultToToken, fromToken, toToken])

  // Calculate exchange rate with debounce
  useEffect(() => {
    // Early return if missing required data
    if (
      !fromToken ||
      !toToken ||
      !fromAmount ||
      !exchangeRates[fromToken.symbol] ||
      !exchangeRates[toToken.symbol]
    ) {
      setToAmount("")
      setIsCalculating(false)
      return
    }

    const amount = parseFloat(fromAmount)

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      setToAmount("")
      setIsCalculating(false)
      return
    }

    // Start calculation
    setIsCalculating(true)

    // Debounce calculation for better performance
    const timer = setTimeout(() => {
      const fromRate = exchangeRates[fromToken.symbol]
      const toRate = exchangeRates[toToken.symbol]
      const result = calculateExchange(amount, fromRate, toRate)
      setToAmount(result.toString())
      setIsCalculating(false)
    }, CALCULATION_DEBOUNCE_MS)

    // Cleanup
    return () => {
      clearTimeout(timer)
      setIsCalculating(false)
    }
  }, [fromAmount, fromToken, toToken, exchangeRates])

  // Cleanup success notification on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Handle token swap (reverse from/to)
   */
  const handleSwap = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      // Store current values before swapping
      const tempToken = fromToken
      const tempAmount = toAmount || "0"

      // Swap tokens
      setFromToken(toToken)
      setToToken(tempToken)

      // Set the new fromAmount and clear toAmount so it recalculates
      setFromAmount(tempAmount)
      setToAmount("")
    },
    [fromToken, toToken, toAmount]
  )

  /**
   * Handle amount input change
   */
  const handleAmountChange = useCallback((value: string) => {
    if (isValidNumericInput(value)) {
      setFromAmount(value)
    }
  }, [])

  /**
   * Handle swap submission
   */
  const handleSwapSubmit = useCallback(async () => {
    setErrorMessage("")
    setSuccessMessage(null)

    // Clear existing timeout
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
    }

    // Validation
    if (!fromToken || !toToken) {
      setErrorMessage("Please select both tokens")
      return
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setErrorMessage("Please enter a valid amount")
      return
    }

    // Simulate swap process
    setIsSwapping(true)
    await new Promise((resolve) => setTimeout(resolve, SWAP_DURATION_MS))
    setIsSwapping(false)

    // Show success message
    const message = `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}!`
    setSuccessMessage(message)

    // Auto-hide after duration
    successTimeoutRef.current = setTimeout(() => {
      setSuccessMessage(null)
    }, SUCCESS_NOTIFICATION_DURATION_MS)
  }, [fromToken, toToken, fromAmount, toAmount])

  /**
   * Close success notification
   */
  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null)
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current)
    }
  }, [])

  // Calculate exchange rate for display
  const exchangeRate =
    fromToken && toToken && toAmount && fromAmount
      ? calculateRate(parseFloat(fromAmount), parseFloat(toAmount))
      : 0

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading tokens...</div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400 text-center">
          <p className="font-semibold mb-2">Failed to load tokens</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Success Notification */}
      {successMessage && (
        <SuccessNotification message={successMessage} onClose={handleCloseSuccess} />
      )}

      <div className="flex flex-col gap-4 w-full max-w-md mx-auto px-4 md:px-0">
        {/* Swap Interface */}
        <div className="bg-[#3a3843] rounded-3xl p-4 md:p-5 shadow-2xl">
          {/* From Section */}
          <div className="mb-2">
            <label className="text-gray-400 text-xs mb-1.5 block">From:</label>
            <div className="bg-[#4a4555] rounded-2xl p-3 border-2 border-purple-600">
              <div className="flex items-center justify-between">
                <TokenSelector token={fromToken} onClick={() => setIsFromModalOpen(true)} />
                <div className="text-right flex-1 ml-2 min-w-0">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={fromAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-white text-right text-2xl font-semibold outline-none w-full"
                    aria-label="From amount"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Swap Button with Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="bg-[#3a3843] border-2 border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 rounded-full p-2 transition-all hover:scale-110 hover:rotate-180 duration-300"
                aria-label="Swap tokens"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* To Section */}
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">To:</label>
            <div className="bg-[#4a4555] rounded-2xl p-3">
              <div className="flex items-center justify-between">
                <TokenSelector token={toToken} onClick={() => setIsToModalOpen(true)} />
                <div className="text-right flex-shrink-0 ml-2">
                  {isCalculating ? (
                    <div className="text-gray-500 text-2xl font-semibold">
                      <span className="animate-pulse">...</span>
                    </div>
                  ) : (
                    <div className="text-white text-2xl font-semibold" aria-label="To amount">
                      {toAmount || "0"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions & Info */}
        <div className="bg-[#3a3843] rounded-3xl p-4 md:p-5 shadow-2xl">
          {/* Slippage Tolerance */}
          <div className="flex items-center justify-between mb-4 text-gray-400 text-xs">
            <span>Slippage Tolerance</span>
            <span className="text-cyan-400 font-medium">Auto: {DEFAULT_SLIPPAGE}%</span>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-xs text-center"
              role="alert"
            >
              {errorMessage}
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwapSubmit}
            disabled={isSwapping || isCalculating}
            className="w-full bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-2xl transition-all hover:scale-[1.02] shadow-lg text-sm"
          >
            {isSwapping ? "Swapping..." : "Swap"}
          </button>

          {/* Exchange Rate Info */}
          {fromToken && toToken && toAmount && !isCalculating && (
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">↻</span>
                <span className="truncate">
                  1 {fromToken.symbol} = {exchangeRate} {toToken.symbol}
                </span>
              </div>
              <div className="text-gray-400">Fee ~1.124 {toToken.symbol}</div>
            </div>
          )}
        </div>
      </div>

      {/* Token Selection Modals */}
      <TokenSelectModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        onSelect={setFromToken}
        tokens={tokens}
        selectedToken={fromToken?.symbol}
        otherSelectedToken={toToken?.symbol}
      />
      <TokenSelectModal
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        onSelect={setToToken}
        tokens={tokens}
        selectedToken={toToken?.symbol}
        otherSelectedToken={fromToken?.symbol}
      />
    </>
  )
}
