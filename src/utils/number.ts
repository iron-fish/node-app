import { formatFixed, parseFixed } from '@ethersproject/bignumber'
import { FixedNumberUtils } from '@ironfish/sdk/build/src/utils/fixedNumber'

const IRON_PRECISION = 8

export const formatOreToTronWithLanguage = (
  ore: bigint,
  fullPrecision = false,
  language?: string
): string => {
  const formattedIron = fullPrecision
    ? FixedNumberUtils.render(ore, IRON_PRECISION)
    : formatFixed(ore, IRON_PRECISION)
  const [significant, fractional] = formattedIron.split('.')
  return `${Number(significant).toLocaleString(
    language || navigator.language
  )}${fractional ? '.' + fractional : '.0'}`
}

export const decodeIron = (amount: string | number): bigint => {
  return parseFixed(amount.toString(), IRON_PRECISION).toBigInt()
}

export const abs = (n: bigint) => (n < BigInt(0) ? -n : n)

export const ORE_TO_IRON = 100000000
