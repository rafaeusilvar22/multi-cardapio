import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'

const api = axios.create({ baseURL: process.env.BACK_END_BASE_URL })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api

  api.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  })
})

export { api }
