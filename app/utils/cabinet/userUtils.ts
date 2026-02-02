export function getUserName(fio: string): string {
  const clean = (fio || '').trim()
  if (!clean) return 'Сотрудник'

  const parts = clean.split(/\s+/).filter(Boolean)
  return parts[1] || parts[0] || 'Сотрудник'
}

export function getUserInitials(fio: string): string {
  const clean = (fio || '').trim()
  if (!clean) return '??'

  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return clean.slice(0, 2).toUpperCase()
}
