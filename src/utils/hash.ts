export function truncateHash(hash: string, parts = 4, chars = 4): string {
  const result = []
  if (hash && hash.length > chars) {
    const blockLength: number = (hash.length - chars) / (parts - 1)

    while (result.length < parts - 1) {
      const startPosition: number = result.length * blockLength
      result.push(hash.slice(startPosition, startPosition + chars))
    }

    result.push(hash.slice(hash.length - chars, hash.length))
  }

  return result.join('...')
}
