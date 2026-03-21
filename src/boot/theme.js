import { defineBoot } from '#q-app/wrappers'
import { setCssVar, Dark } from 'quasar'
import { useAuthStore } from 'src/stores/auth'

export function applyThemeColors(customization) {
  if (!customization) return
  if (customization.primary_color) setCssVar('primary', customization.primary_color)
  if (customization.secondary_color) setCssVar('secondary', customization.secondary_color)
  if (customization.emphasis_color) setCssVar('accent', customization.emphasis_color)
}

export default defineBoot(({ store }) => {
  const saved = localStorage.getItem('darkMode')
  if (saved !== null) {
    Dark.set(saved === '1')
  }

  const authStore = useAuthStore(store)
  const list = authStore.authCustomizations || []
  const withColors = list.filter((c) => c.status === 'active' && c.primary_color)
  const customization = withColors.at(-1) || list.at(-1) || null

  applyThemeColors(customization)
})
