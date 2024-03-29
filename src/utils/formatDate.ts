import { parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export const formatDate = (date: Date) => {
  if (!date) {
    return ''
  }
  return formatInTimeZone(
    parseISO(date.toISOString()),
    'UTC',
    `yyyy-MM-dd HH:mm:ss zzz`
  )
}
