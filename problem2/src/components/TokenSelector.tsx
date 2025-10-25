import { ChevronDown } from "lucide-react"
import { Token } from "@/types/token"

interface TokenSelectorProps {
  token: Token | null
  onClick: () => void
  className?: string
}

/**
 * Token selector button component
 * Displays selected token with icon and name, or placeholder
 */
export function TokenSelector({ token, onClick, className = "" }: TokenSelectorProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 hover:opacity-80 transition-opacity min-w-0 ${className}`}
    >
      {token ? (
        <>
          <img
            src={token.icon}
            alt={token.symbol}
            className="w-8 h-8 flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = "none"
            }}
          />
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm">{token.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
            <div className="text-gray-400 text-xs truncate">{token.name}</div>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2 text-white text-sm">
          <span>Select token</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </button>
  )
}

