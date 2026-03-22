import { api } from 'src/boot/axios'
import { errorsMiddleware } from 'src/utils/errorMiddleware'
import { API_ENDPOINTS } from './endpoints'

const base = (productUuid) => `${API_ENDPOINTS.PRODUCTS}/${productUuid}/recommendations`

export const RecommendationService = {
  async getRecommendations(productUuid) {
    try {
      const resp = await api.get(base(productUuid))
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async syncRecommendations(productUuid, productIds) {
    try {
      const resp = await api.put(base(productUuid), { product_ids: productIds })
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },
}
