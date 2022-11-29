const ORDER_COLOR = [
  {
    from: '#85ADFD',
    to: '#4B87FF',
  },
  {
    from: '#FFE2B9',
    to: '#FFCD85',
  },
  {
    from: '#FFD7F0',
    to: '#FFC2E8',
  },
  {
    from: '#FFF698',
    to: '#FFEC1F',
  },
  {
    from: '#FF9A7A',
    to: '#F15929',
  },
  {
    from: '#53C025',
    to: '#389810',
  },
  {
    from: '#FFF4E0',
    to: '#FFEBC7',
  },
  {
    from: '#DEFFFE',
    to: '#B9FAF8',
  },
  {
    from: '#C8C8C8',
    to: '#878E88',
  },
  {
    from: '#E1AF8F',
    to: '#B17A57',
  },
  {
    from: '#FF86B8',
    to: '#ED5292',
  },
  {
    from: '#B0A78C',
    to: '#756D54',
  },
]

export function accountGradientByOrder(
  order: number,
  colorFrom?: string,
  colorTo?: string
) {
  const colors = ORDER_COLOR[order % ORDER_COLOR.length]
  return `linear-gradient(89.56deg, ${colorFrom || colors.from} 0.38%, ${
    colorTo || colors.to
  } 99.64%)`
}
