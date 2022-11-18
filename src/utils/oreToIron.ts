export const oreToIron = (ore: bigint): number => {
  return ore ? Number(ore) / 10000000 : 0
}

export const oreToFormattedIron = (ore: bigint): string =>
  oreToIron(ore).toLocaleString(navigator.language, {
    maximumFractionDigits: 7,
  })
