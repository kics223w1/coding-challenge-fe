import { useEffect, useState } from "react"

interface PriceData {
  currency: string
  date: string
  price: number
}

interface TokenPrice {
  currency: string
  price: number
  icon: string
}

export function TokenInfoBanner() {
  const [prices, setPrices] = useState<TokenPrice[]>([])

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((response) => response.json())
      .then((data: PriceData[]) => {
        // Group by currency and get the latest price for each
        const priceMap = new Map<string, number>()
        data.forEach((item) => {
          const existing = priceMap.get(item.currency)
          if (!existing || existing < item.price) {
            priceMap.set(item.currency, item.price)
          }
        })

        // Convert to array with icons
        const pricesArray: TokenPrice[] = Array.from(priceMap.entries()).map(
          ([currency, price]) => ({
            currency,
            price,
            icon: `/tokens/${currency}.svg`,
          })
        )

        setPrices(pricesArray)
      })
      .catch((error) => {
        console.error("Error fetching prices:", error)
      })
  }, [])

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-4 shadow-lg overflow-hidden">
      <div className="relative flex">
        {/* First set of scrolling items */}
        <div className="flex animate-scroll whitespace-nowrap">
          {prices.map((token, index) => (
            <div
              key={`${token.currency}-1-${index}`}
              className="flex items-center gap-3 mx-6 text-sm"
            >
              <img
                src={token.icon}
                alt={token.currency}
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <span className="font-semibold">{token.currency}</span>
              <span className="text-slate-300">
                ${token.price < 0.01 
                  ? token.price.toFixed(6) 
                  : token.price < 1 
                  ? token.price.toFixed(4)
                  : token.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </span>
            </div>
          ))}
        </div>
        {/* Duplicate set for seamless loop */}
        <div className="flex animate-scroll whitespace-nowrap" aria-hidden="true">
          {prices.map((token, index) => (
            <div
              key={`${token.currency}-2-${index}`}
              className="flex items-center gap-3 mx-6 text-sm"
            >
              <img
                src={token.icon}
                alt={token.currency}
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <span className="font-semibold">{token.currency}</span>
              <span className="text-slate-300">
                ${token.price < 0.01 
                  ? token.price.toFixed(6) 
                  : token.price < 1 
                  ? token.price.toFixed(4)
                  : token.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

