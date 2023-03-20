export const formatRemainingTime = (time: number, parts = 2): string => {
  const updateResult = (value: number, unit: Intl.RelativeTimeFormatUnit) => {
    if (!value) {
      return
    }

    const formatParts = new Intl.RelativeTimeFormat('en').formatToParts(
      value,
      unit
    )

    if (result.length === parts) {
      result.shift()
    }

    result.push(value ? formatParts[1].value + formatParts[2].value : '')
  }

  if (time <= 1000) {
    return 'remaining less than second'
  }

  const date = new Date(time)
  const zeroDate = new Date(0)
  const result: [string?, string?] = []

  updateResult(date.getUTCSeconds() - zeroDate.getUTCSeconds(), 'seconds')
  updateResult(date.getUTCMinutes() - zeroDate.getUTCMinutes(), 'minutes')
  updateResult(date.getUTCHours() - zeroDate.getUTCHours(), 'hours')
  updateResult(date.getUTCDate() - zeroDate.getUTCDate(), 'days')
  updateResult(date.getUTCMonth() - zeroDate.getUTCMonth(), 'months')
  updateResult(date.getUTCFullYear() - zeroDate.getUTCFullYear(), 'years')

  return (
    result
      .filter(e => !!e)
      .reverse()
      .join(' ') + ' remaining'
  )
}
