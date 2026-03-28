import axios from 'axios'
import { API_BASE_URL, API_PREFIX, API_RESOURCE } from '../lib/config'
import { normalizeItem, normalizeItems } from '../lib/normalize'

const api = axios.create({
  baseURL: `${API_BASE_URL}${API_PREFIX}`,
  timeout: 10000,
})

const getPayload = (response) => response?.data ?? response

const extractCollectionPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  return []
}

const extractItemPayload = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data
  }

  if (payload?.item && !Array.isArray(payload.item)) {
    return payload.item
  }

  return payload
}

export const fetchItems = async () => {
  const response = await api.get(`/${API_RESOURCE}`)
  const payload = getPayload(response)
  return normalizeItems(extractCollectionPayload(payload))
}

export const fetchItemById = async (id) => {
  const response = await api.get(`/${API_RESOURCE}/${id}`)
  const payload = getPayload(response)
  return normalizeItem(extractItemPayload(payload))
}
