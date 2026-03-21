import { defineStore } from 'pinia'
import { PublicService } from 'src/services/PublicService'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    group: null,
    customizations: [],
    businessHours: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Retorna a customização ativa mais recente com cores definidas, ou a última disponível
    activeCustomization: (state) => {
      const withColors = state.customizations.filter(
        (c) => c.status === 'active' && c.primary_color,
      )
      return withColors.at(-1) || state.customizations.at(-1) || null
    },
  },

  actions: {
    async fetchCustomization(slug) {
      this.loading = true
      this.error = null
      try {
        const resp = await PublicService.getCustomization(slug)
        const data = resp?.data
        this.group = data?.workspace || data?.group || null
        this.customizations = data?.customizations || []
        this.businessHours = data?.businessHours || []
      } catch (err) {
        this.error = err.message || 'Estabelecimento não encontrado.'
      } finally {
        this.loading = false
      }
    },
  },
})
