import { api } from 'src/boot/axios'
import { errorsMiddleware } from 'src/utils/errorMiddleware'
import { API_ENDPOINTS } from './endpoints'

const base = (productUuid) => `${API_ENDPOINTS.PRODUCTS}/${productUuid}/flavors`

export const FlavorService = {
  // ── Sabores ────────────────────────────────────────────────────

  async getFlavors(productUuid) {
    try {
      const resp = await api.get(base(productUuid))
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async createFlavor(productUuid, data) {
    try {
      const resp = await api.post(base(productUuid), data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateFlavor(productUuid, flavorUuid, data) {
    try {
      const resp = await api.patch(`${base(productUuid)}/${flavorUuid}`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async deleteFlavor(productUuid, flavorUuid) {
    try {
      const resp = await api.delete(`${base(productUuid)}/${flavorUuid}`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  // ── Ingredientes ───────────────────────────────────────────────

  async createIngredient(productUuid, flavorUuid, data) {
    try {
      const resp = await api.post(`${base(productUuid)}/${flavorUuid}/ingredients`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateIngredient(productUuid, flavorUuid, ingredientUuid, data) {
    try {
      const resp = await api.patch(
        `${base(productUuid)}/${flavorUuid}/ingredients/${ingredientUuid}`,
        data,
      )
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async deleteIngredient(productUuid, flavorUuid, ingredientUuid) {
    try {
      const resp = await api.delete(
        `${base(productUuid)}/${flavorUuid}/ingredients/${ingredientUuid}`,
      )
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },
}
