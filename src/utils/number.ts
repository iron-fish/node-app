import { CurrencyUtils } from '@ironfish/sdk/build/src/utils/currency'

export const formatOreToTronWithLanguage = (
  ore: bigint | string | number,
  language?: string
): string => {
  const formattedIron = CurrencyUtils.encodeIron(BigInt(ore))
  const [significant, fractional] = formattedIron.split('.')
  return `${Number(significant).toLocaleString(
    language || navigator.language
  )}.${fractional}`
}
