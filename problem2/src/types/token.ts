/**
 * Core type definitions for the token swap application
 */

export interface PriceData {
  currency: string
  date: string
  price: number
}

export interface Token {
  symbol: string
  name: string
  icon: string
  price: number
}

export interface ExchangeRates {
  [key: string]: number
}

