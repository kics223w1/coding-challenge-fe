import { useState, useEffect, useMemo } from "react"
import { X, Search, ChevronRight } from "lucide-react"
import { Token } from "@/types/token"

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (token: Token) => void
  tokens: Token[]
  selectedToken?: string
  otherSelectedToken?: string
}

/**
 * Token selection modal component
 * Displays a searchable list of available tokens for selection
 */
export function TokenSelectModal({
  isOpen,
  onClose,
  onSelect,
  tokens,
  selectedToken,
  otherSelectedToken,
}: TokenSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
    }
  }, [isOpen])

  // Filter tokens based on search query
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) {
      return tokens
    }

    const query = searchQuery.toLowerCase()
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(query) ||
        token.name.toLowerCase().includes(query)
    )
  }, [searchQuery, tokens])

  /**
   * Handle token selection
   */
  const handleSelectToken = (token: Token) => {
    const isDisabled = selectedToken === token.symbol || otherSelectedToken === token.symbol
    if (!isDisabled) {
      onSelect(token)
      onClose()
    }
  }

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md mx-4 bg-[#2a2532] rounded-3xl shadow-2xl max-h-[80vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 id="modal-title" className="text-xl font-semibold text-white">
            Select Token
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search name or symbol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#3d3646] text-white placeholder-gray-400 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 border-2 border-purple-500/50"
              aria-label="Search tokens"
            />
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filteredTokens.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No tokens found</p>
              <p className="text-sm mt-1">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTokens.map((token) => {
                const isDisabled =
                  selectedToken === token.symbol || otherSelectedToken === token.symbol

                return (
                  <button
                    key={token.symbol}
                    onClick={() => handleSelectToken(token)}
                    disabled={isDisabled}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors group ${
                      isDisabled
                        ? "bg-[#3d3646] opacity-50 cursor-not-allowed"
                        : "hover:bg-[#3d3646] cursor-pointer"
                    }`}
                    aria-label={`Select ${token.name}`}
                    aria-disabled={isDisabled}
                  >
                    <img
                      src={token.icon}
                      alt=""
                      className={`w-10 h-10 ${isDisabled ? "opacity-50 blur-[2px]" : ""}`}
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                    <div className="flex-1 text-left min-w-0">
                      <div
                        className={`font-semibold truncate ${
                          isDisabled ? "text-gray-500" : "text-white"
                        }`}
                      >
                        {token.symbol}
                      </div>
                      <div className="text-sm text-gray-400 truncate">{token.name}</div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 flex-shrink-0 ${
                        isDisabled ? "text-gray-700" : "text-gray-600 group-hover:text-gray-400"
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
