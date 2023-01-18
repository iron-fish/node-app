import { formatFixed } from '@ethersproject/bignumber'

export const formatOreToTronWithLanguage = (
  ore: bigint,
  language?: string
): string => {
  const formattedIron = formatFixed(ore, 8)
  const [significant, fractional] = formattedIron.split('.')
  return `${Number(significant).toLocaleString(
    language || navigator.language
  )}${fractional ? '.' + fractional : '.0'}`
}

export const ORE_TO_IRON = 100000000
