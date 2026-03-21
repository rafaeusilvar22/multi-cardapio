const TZ = 'America/Sao_Paulo'

/**
 * Normalizes a date input to a JavaScript Date, always treating
 * strings without explicit timezone info as UTC.
 * Handles: ISO strings with/without Z, PostgreSQL "YYYY-MM-DD HH:mm:ss" format.
 */
const toUTC = (isoDate) => {
  if (!isoDate) return null
  if (isoDate instanceof Date) return isoDate
  const str = String(isoDate).trim()
  // If there's no timezone indicator (Z or ±HH:MM), treat as UTC
  if (!/Z|[+-]\d{2}:?\d{2}$/.test(str)) {
    return new Date(str.replace(' ', 'T') + 'Z')
  }
  return new Date(str)
}

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatTime = (isoDate) => {
  const date = toUTC(isoDate)
  if (!date) return ''
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  })
}

export const formatDate = (isoDate) => {
  const date = toUTC(isoDate)
  if (!date) return ''
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: TZ,
  })
}

export const formatDateTime = (isoDate) => {
  const date = toUTC(isoDate)
  if (!date) return ''
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  })
}
