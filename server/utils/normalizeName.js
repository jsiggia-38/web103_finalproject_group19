export const normalizeNameForSearch = (name) => {
  if (typeof name !== 'string') {
    return ''
  }

  return name
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

export const formatDisplayName = (name) => {
  if (typeof name !== 'string') {
    return ''
  }

  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((part) => {
      return (
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase()
      )
    })
    .join(' ')
}