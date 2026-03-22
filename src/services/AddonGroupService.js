import { api } from 'src/boot/axios'
import { errorsMiddleware } from 'src/utils/errorMiddleware'
import { API_ENDPOINTS } from './endpoints'

const base = (productUuid) => `${API_ENDPOINTS.PRODUCTS}/${productUuid}/addon-groups`

export const AddonGroupService = {
  // ── Grupos ────────────────────────────────────────────────────

  async getGroups(productUuid) {
    try {
      const resp = await api.get(base(productUuid))
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async createGroup(productUuid, data) {
    try {
      const resp = await api.post(base(productUuid), data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateGroup(productUuid, groupUuid, data) {
    try {
      const resp = await api.patch(`${base(productUuid)}/${groupUuid}`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async deleteGroup(productUuid, groupUuid) {
    try {
      const resp = await api.delete(`${base(productUuid)}/${groupUuid}`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  // ── Adicionais ────────────────────────────────────────────────

  async createAddon(productUuid, groupUuid, data) {
    try {
      const resp = await api.post(`${base(productUuid)}/${groupUuid}/addons`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateAddon(productUuid, groupUuid, addonUuid, data) {
    try {
      const resp = await api.patch(`${base(productUuid)}/${groupUuid}/addons/${addonUuid}`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async deleteAddon(productUuid, groupUuid, addonUuid) {
    try {
      const resp = await api.delete(`${base(productUuid)}/${groupUuid}/addons/${addonUuid}`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },
}
