<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="rs-header" :class="isDark ? 'rs-header--dark' : 'rs-header--light'">
      <q-toolbar class="rs-toolbar">
        <q-btn
          flat
          dense
          round
          :icon="leftDrawerOpen ? 'menu_open' : 'menu'"
          aria-label="Menu"
          class="rs-toolbar-btn"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="rs-toolbar-title">{{ groupName }}</q-toolbar-title>

        <q-space />

        <!-- Notifications -->
        <q-btn
          flat
          dense
          round
          :color="newOrdersCount > 0 ? 'negative' : undefined"
          :icon="newOrdersCount > 0 ? 'notifications_active' : 'notifications'"
          aria-label="Pedidos"
          class="rs-toolbar-btn"
          @click="handleBellClick"
        >
          <q-badge
            v-if="newOrdersCount > 0"
            color="negative"
            :label="newOrdersCount > 99 ? '99+' : newOrdersCount"
            floating
            rounded
          />
          <q-tooltip>{{
            newOrdersCount > 0 ? `${newOrdersCount} novo(s) pedido(s)` : 'Pedidos'
          }}</q-tooltip>
        </q-btn>

        <!-- Dark mode toggle -->
        <q-btn
          flat
          dense
          round
          :icon="isDark ? 'light_mode' : 'dark_mode'"
          :aria-label="isDark ? 'Modo claro' : 'Modo escuro'"
          class="rs-toolbar-btn"
          @click="toggleDark"
        />

        <q-separator vertical inset class="q-mx-sm" />

        <!-- User menu -->
        <q-btn-dropdown flat dense no-caps dropdown-icon="expand_more" class="rs-user-dropdown">
          <template v-slot:label>
            <q-avatar size="32px" color="white" text-color="primary" class="rs-user-avatar">
              {{ getInitials(userName) }}
            </q-avatar>
            <div class="text-left q-ml-sm gt-xs">
              <div class="rs-m-regular text-weight-medium">{{ userName }}</div>
              <div class="rs-s-regular opacity-75">{{ userRole }}</div>
            </div>
          </template>

          <div class="rs-user-card">
            <!-- Header colorido -->
            <div class="rs-user-card-header">
              <q-avatar size="72px" color="white" text-color="primary" class="rs-user-card-avatar">
                {{ getInitials(userName) }}
              </q-avatar>
              <div class="q-mt-sm text-white text-weight-bold text-subtitle1">{{ userName }}</div>
              <q-chip dense outline color="white" text-color="white" class="q-mt-xs" size="sm">
                {{ userRole }}
              </q-chip>
            </div>

            <!-- Info do usuário -->
            <div class="rs-user-card-body">
              <q-item dense class="rs-user-info-item">
                <q-item-section avatar>
                  <q-icon name="email" color="grey-5" size="16px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-caption text-grey-5">E-mail</q-item-label>
                  <q-item-label>
                    <a class="text-primary text-caption" :href="`mailto:${userEmail}`">{{
                      userEmail
                    }}</a>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item dense class="rs-user-info-item">
                <q-item-section avatar>
                  <q-icon name="storefront" color="grey-5" size="16px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-caption text-grey-5">Estabelecimento</q-item-label>
                  <q-item-label class="text-caption">{{ groupName }}</q-item-label>
                </q-item-section>
              </q-item>
            </div>

            <!-- Ações -->
            <div class="rs-user-card-actions">
              <q-btn
                no-caps
                flat
                color="grey-7"
                icon="settings"
                label="Configurações"
                class="full-width rs-user-action-btn"
                v-close-popup
                :to="{ name: 'configuracoes-estabelecimento' }"
              />
              <q-separator />
              <q-btn
                no-caps
                flat
                color="negative"
                icon="logout"
                label="Sair da conta"
                class="full-width rs-user-action-btn"
                v-close-popup
                @click="handleLogout()"
              />
            </div>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      :mini="miniState"
      bordered
      :width="210"
      :breakpoint="500"
      show-if-above
      v-model="leftDrawerOpen"
      :style="isDark ? 'background: #1a1a1a; border-right: 1px solid #2a2a2a' : ''"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
    >
      <div class="rs-drawer-logo-section">
        <q-img class="logo" :src="groupLogo" />
      </div>
      <q-separator />
      <q-list class="q-mt-sm q-px-sm">
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            v-ripple
            clickable
            :active="$route.name === menuItem.route"
            active-class="rs-menu-item--active"
            class="rs-menu-item"
            :to="menuItem.route ? { name: menuItem.route } : undefined"
            @click="menuItem.action ? menuItem.action() : undefined"
          >
            <q-item-section avatar>
              <q-icon
                :name="menuItem.icon"
                :color="$route.name === menuItem.route ? 'primary' : 'grey-6'"
                size="xs"
              />
            </q-item-section>
            <q-item-section
              class="rs-l-regular"
              :class="
                $route.name === menuItem.route
                  ? 'text-primary text-weight-medium'
                  : isDark
                    ? 'text-grey-4'
                    : 'text-grey-7'
              "
            >
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator v-if="menuItem.separator" class="q-my-xs" />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="rs-constrain-width">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dark } from 'quasar'
import useStringHelpers from 'src/composables/useStringHelpers'
import { useAuthStore } from 'src/stores/auth'
import { applyThemeColors } from 'src/boot/theme'
import { useOrderPolling } from 'src/composables/useOrderPolling'

const { getInitials } = useStringHelpers()
const router = useRouter()
const authStore = useAuthStore()

const { newOrdersCount, clearNewOrders, startPolling, stopPolling } = useOrderPolling()

const handleBellClick = () => {
  clearNewOrders()
  router.push({ name: 'pedidos' })
}

const leftDrawerOpen = ref(false)
const miniState = ref(true)

const DARK_MODE_KEY = 'darkMode'
const isDark = computed(() => Dark.isActive)

function toggleDark() {
  Dark.toggle()
  localStorage.setItem(DARK_MODE_KEY, Dark.isActive ? '1' : '0')
  applyColors()
}

const groupName = computed(() => authStore.group?.name || 'Multi Cardápio')
const groupLogo = computed(
  () =>
    authStore.group?.logo ||
    'https://png.pngtree.com/png-clipart/20200727/original/pngtree-restaurant-logo-design-vector-template-png-image_5441058.jpg',
)

const userName = computed(() => {
  const p = authStore.profile
  if (p?.first_name) return `${p.first_name} ${p.last_name || ''}`.trim()
  const u = authStore.user
  if (!u) return ''
  return u.usr_name || u.name || u.usr_full_name || u.full_name || ''
})

const userEmail = computed(() => {
  const p = authStore.profile
  if (p?.email) return p.email
  const u = authStore.user
  if (!u) return ''
  return u.usr_email || u.email || ''
})

const userRole = computed(() => {
  const p = authStore.profile
  if (p?.office) return p.office
  if (p?.type) return p.type
  const u = authStore.user
  if (!u) return ''
  return u.role?.name || u.usr_role || u.perfil?.nome || 'Usuário'
})

const activeCustomization = computed(() => authStore.activeCustomization)

function applyColors() {
  applyThemeColors(activeCustomization.value)
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
watch(activeCustomization, () => applyColors())
function updateTitle() {
  const prefix = newOrdersCount.value > 0 ? `(${newOrdersCount.value}) ` : ''
  document.title = `${prefix}${groupName.value}`
}
watch([groupName, newOrdersCount], updateTitle, { immediate: true })

watch(
  groupLogo,
  (url) => {
    if (!url) return
    const link = document.getElementById('dynamic-favicon')
    if (link) link.href = url
  },
  { immediate: true },
)

const isSuperAdmin = computed(() => authStore.profile?.type === 'super-admin')

const ownerMenuList = [
  { label: 'Início', icon: 'fa-solid fa-house', route: 'dashboard' },
  { label: 'Pedidos', icon: 'fa-solid fa-utensils', route: 'pedidos' },
  { label: 'Produtos', icon: 'fa-solid fa-burger', route: 'produtos' },
  { label: 'Categoria', icon: 'fa-solid fa-layer-group', route: 'categorias' },
  { label: 'Cupons', icon: 'fa-solid fa-ticket', route: 'cupons' },
  { label: 'Ajustes', icon: 'fa-solid fa-gear', route: 'configuracoes-estabelecimento' },
]

const adminMenuList = [
  { label: 'Estabelecimentos', icon: 'fa-solid fa-store', route: 'admin-workspaces' },
]

const menuList = computed(() => (isSuperAdmin.value ? adminMenuList : ownerMenuList))

const handleLogout = async () => {
  await authStore.logout()
  router.push({ name: 'login' })
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
<style lang="scss" scoped>
/* Header */
.rs-header {
  border-bottom: 1px solid transparent;
}

.rs-header--light {
  background: #ffffff;
  border-bottom-color: #eeeeee;
  color: #212121;
}

.rs-header--dark {
  background: #1a1a1a;
  border-bottom-color: #2a2a2a;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
}

/* Toolbar */
.rs-toolbar {
  min-height: 64px;
  padding: 0 16px;
}

.rs-toolbar-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.rs-toolbar-btn {
  opacity: 0.75;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

/* User dropdown trigger */
.rs-user-dropdown {
  border-radius: 8px;
  padding: 4px 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
}

.rs-user-avatar {
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 0 0 2px var(--q-primary);
}

/* User card (dropdown panel) */
.rs-user-card {
  min-width: 260px;
  overflow: hidden;
}

.rs-user-card-header {
  background: linear-gradient(135deg, rgba(229, 57, 53, 0.92) 0%, rgba(183, 28, 28, 0.95) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 20px;
  text-align: center;
}

.rs-user-card-avatar {
  font-size: 22px;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.rs-user-card-body {
  padding: 12px 8px 4px;
}

.rs-user-info-item {
  border-radius: 6px;
  min-height: 48px;
}

.rs-user-card-actions {
  padding: 4px 0 0;
}

.rs-user-action-btn {
  border-radius: 0;
  justify-content: flex-start;
  padding: 10px 16px;
  font-size: 13px;
}

/* Drawer */
.rs-drawer-logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  min-height: 64px;
}

.logo {
  width: 100%;
  max-width: 140px;
}

/* Menu items */
.rs-menu-item {
  border-radius: 8px;
  margin-bottom: 2px;
  min-height: 44px;
}

.rs-menu-item--active {
  background: rgba(var(--q-primary-rgb, 229, 57, 53), 0.12) !important;
  border-left: 3px solid var(--q-primary);
}

:global(.body--dark) .rs-menu-item--active {
  background: rgba(239, 154, 154, 0.15) !important;
}

:global(.body--dark) .rs-menu-item:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

:global(.body--dark) .rs-user-dropdown:hover {
  background: rgba(255, 255, 255, 0.06) !important;
}
</style>
