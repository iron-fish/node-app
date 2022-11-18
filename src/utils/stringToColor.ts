export function stringToColor(value = '', lightness = 100) {
  let colorNumber = 0
  Array.from(value).forEach(char => {
    colorNumber += char.charCodeAt(0)
  })

  return `hsl(${colorNumber % 255}, 100%, ${lightness}%)`
}
