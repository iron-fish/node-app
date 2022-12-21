export const formatRemainingTime = (time: number): string => {
  const updateResult = (value: number, unit: Intl.RelativeTimeFormatUnit) => {
    if (!value) {
      return
    }

    const parts = new Intl.RelativeTimeFormat('en').formatToParts(value, unit)

    if (result.length === 2) {
      result.shift()
    }

    result.push(value ? parts[1].value + parts[2].value : '')
  }

  if (time <= 1000) {
    return 'remaining less than second'
  }

  const date = new Date(time)
  const zeroDate = new Date(0)
  const result: [string?, string?] = []

  updateResult(date.getSeconds() - zeroDate.getSeconds(), 'seconds')
  updateResult(date.getMinutes() - zeroDate.getMinutes(), 'minutes')
  updateResult(date.getHours() - zeroDate.getHours(), 'hours')
  updateResult(date.getDate() - zeroDate.getDate(), 'days')
  updateResult(date.getMonth() - zeroDate.getMonth(), 'months')
  updateResult(date.getFullYear() - zeroDate.getFullYear(), 'years')

  return (
    result
      .filter(e => !!e)
      .reverse()
      .join(' ') + ' remaining'
  )
}
