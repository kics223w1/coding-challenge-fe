/**
 * Token names mapping for display purposes
 */
export const TOKEN_NAMES: Record<string, string> = {
  BLUR: "Blur",
  bNEO: "Binance NEO",
  BUSD: "Binance USD",
  USD: "US Dollar",
  ETH: "Ethereum",
  GMX: "GMX",
  STEVMOS: "Staked EVMOS",
  LUNA: "Terra Luna",
  RATOM: "Rho ATOM",
  STRD: "Stride",
  EVMOS: "EVMOS",
  IBCX: "IBC Index",
  IRIS: "IRISnet",
  ampLUNA: "Amplified LUNA",
  KUJI: "Kujira",
  STOSMO: "Staked OSMO",
  USDC: "USD Coin",
  axlUSDC: "Axelar USDC",
  ATOM: "Cosmos",
  STATOM: "Staked ATOM",
  OSMO: "Osmosis",
  rSWTH: "Reward SWTH",
  STLUNA: "Staked LUNA",
  LSI: "LSI",
  OKB: "OKB",
  OKT: "OKT Chain",
  SWTH: "Switcheo",
  USC: "USC",
  WBTC: "Wrapped BTC",
  wstETH: "Wrapped stETH",
  YieldUSD: "Yield USD",
  ZIL: "Zilliqa",
}

/**
 * API endpoint for fetching token prices
 */
export const PRICE_API_URL = "https://interview.switcheo.com/prices.json"

/**
 * Default token selections
 */
export const DEFAULT_FROM_TOKEN = "ETH"
export const DEFAULT_TO_TOKEN = "BLUR"
export const DEFAULT_AMOUNT = "500"

