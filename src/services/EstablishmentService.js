import { api } from 'src/boot/axios'
import { errorsMiddleware } from 'src/utils/errorMiddleware'
import { API_ENDPOINTS } from './endpoints'

const BASE = API_ENDPOINTS.GROUPS;

export const EstablishmentService = {
  async getGroup(uuid) {
    try {
      const resp = await api.get(`${BASE}/uuid/${uuid}`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateSettings(uuid, data) {
    try {
      const resp = await api.patch(`${BASE}/uuid/${uuid}/settings`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async getBusinessHours(groupUuid) {
    try {
      const resp = await api.get(`${BASE}/${groupUuid}/business-hours`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async createBusinessHours(groupUuid, data) {
    try {
      const resp = await api.post(`${BASE}/${groupUuid}/business-hours`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateBusinessHours(groupUuid, bhUuid, data) {
    try {
      const resp = await api.patch(`${BASE}/${groupUuid}/business-hours/${bhUuid}`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async deleteBusinessHours(groupUuid, bhUuid) {
    try {
      const resp = await api.delete(`${BASE}/${groupUuid}/business-hours/${bhUuid}`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async getCustomizations(groupUuid) {
    try {
      const resp = await api.get(`${BASE}/${groupUuid}/customization`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async createCustomization(groupUuid, data) {
    try {
      const resp = await api.post(`${BASE}/${groupUuid}/customization`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateCustomization(groupUuid, customizationUuid, data) {
    try {
      const resp = await api.patch(`${BASE}/${groupUuid}/customization/${customizationUuid}`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async deleteCustomization(groupUuid, customizationUuid) {
    try {
      const resp = await api.delete(`${BASE}/${groupUuid}/customization/${customizationUuid}`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async uploadLogo(uuid, file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const resp = await api.post(`${BASE}/${uuid}/upload/logo`, formData)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async uploadBanner(uuid, file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const resp = await api.post(`${BASE}/${uuid}/upload/banner`, formData)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },
}
