import { formatFixed, parseFixed } from '@ethersproject/bignumber'

const IRON_PRECISION = 8

export const formatOreToTronWithLanguage = (
  ore: bigint,
  fullPrecision: false,
  language?: string
): string => {
  const formattedIron = formatFixed(ore, IRON_PRECISION)
  const splitted = formattedIron.split('.')
  const significant = splitted[0]
  let fractional = splitted[1]
  if (fullPrecision && fractional.length < IRON_PRECISION) {
    fractional = fractional.concat(
      ...new Array(IRON_PRECISION - fractional.length).fill('0')
    )
  }
  return `${Number(significant).toLocaleString(
    language || navigator.language
  )}${fractional ? '.' + fractional : '.0'}`
}

export const decodeIron = (amount: string | number): bigint => {
  return parseFixed(amount.toString(), IRON_PRECISION).toBigInt()
}

export const abs = (n: bigint) => (n < BigInt(0) ? -n : n)

export const ORE_TO_IRON = 100000000
