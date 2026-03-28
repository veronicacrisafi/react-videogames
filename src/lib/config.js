const trimSlash = (value) => value.replace(/\/$/, '')

const getBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_BASE_URL
  if (fromEnv && fromEnv.trim().length > 0) {
    return trimSlash(fromEnv.trim())
  }

  return 'http://localhost:3000'
}

const getApiPrefix = () => {
  const fromEnv = import.meta.env.VITE_API_PREFIX
  if (!fromEnv) {
    return ''
  }

  const clean = fromEnv.trim()
  if (clean.length === 0 || clean === '/') {
    return ''
  }

  return clean.startsWith('/') ? clean : `/${clean}`
}

export const API_BASE_URL = getBaseUrl()
export const API_PREFIX = getApiPrefix()
export const API_RESOURCE =
  import.meta.env.VITE_API_RESOURCE?.trim() || 'videogames'
