import { api } from 'src/boot/axios'
import { API_ENDPOINTS } from './endpoints'

const BASE = API_ENDPOINTS.PUBLIC;

export const PublicService = {
  async getCustomization(slug) {
    const resp = await api.get(`${BASE}/${slug}/customization`)
    return resp.data
  },

  async trackOrder(slug, orderUuid) {
    const resp = await api.get(`${BASE}/${slug}/orders/${orderUuid}`)
    return resp.data
  },

  async getOrderMessages(slug, orderUuid) {
    const resp = await api.get(`${BASE}/${slug}/orders/${orderUuid}/messages`)
    return resp.data
  },
}
