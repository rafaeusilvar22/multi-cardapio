<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          :icon="leftDrawerOpen ? 'menu_open' : 'menu'"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Nome Estabelecimento </q-toolbar-title>

        <q-space />

        <q-btn-dropdown flat dense no-caps dropdown-icon="keyboard_arrow_down">
          <template v-slot:label>
            <q-avatar size="28px" color="white" text-color="primary">
              {{ getInitials('Rafael Silva') }}
            </q-avatar>
            <div class="text-left q-ml-sm">
              <p class="rs-m-regular">{{ 'Rafael Silva' }}</p>
              <p class="rs-s-regular">Admin</p>
            </div>
          </template>
          <div class="column items-center q-pa-md q-gutter-y-sm">
            <q-avatar size="56px" color="primary" text-color="white">
              {{ getInitials('Rafael Silva') }}
            </q-avatar>

            <div class="rs-xl-semibold">{{ user?.nome }}</div>

            <p>
              E-mail:
              <a class="text-secondary" :href="`mailto:${user?.email}`">{{ user?.email }}</a>
            </p>
            <q-chip outline color="primary" text-color="white">
              {{ user?.perfil.nome }}
            </q-chip>
            <p>
              Orgão: <span class="rs-m-semibold">{{ user?.orgao.nome }}</span>
            </p>

            <q-separator class="q-my-md full-width" />
            <q-btn
              no-caps
              rounded
              size="md"
              unelevated
              label="Sair"
              v-close-popup
              color="primary"
              icon-right="logout"
              @click="handleLogout()"
            />
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>
    <q-drawer
      :mini="miniState"
      bordered
      :width="200"
      :breakpoint="500"
      show-if-above
      class="q-gutter-y-md"
      v-model="leftDrawerOpen"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
    >
      <div class="flex q-pa-md">
        <q-img
          class="logo"
          src="https://logodownload.org/wp-content/uploads/2014/04/mcdonalds-logo-1-1.png"
        />
      </div>
      <q-separator />
      <q-list class="q-gutter-y-xs">
        <template v-for="(menuItem, index) in menuList" :key="index">
          <q-item
            v-ripple
            clickable
            :active="$route.name === menuItem.route"
            active-class="bg-primary text-white"
            :to="menuItem.route ? { name: menuItem.route } : undefined"
            @click="menuItem.action ? menuItem.action() : undefined"
          >
            <q-item-section avatar>
              <q-icon
                :name="menuItem.icon"
                :color="$route.name === menuItem.route ? 'white' : 'primary'"
                size="xs"
              />
            </q-item-section>
            <q-item-section
              class="rs-l-regular"
              :class="$route.name === menuItem.route ? 'text-white' : 'text-primary'"
            >
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator v-if="menuItem.separator" />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="rs-constrain-width">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import useStringHelpers from 'src/composables/useStringHelpers'

const { getInitials } = useStringHelpers()

const leftDrawerOpen = ref(false)
const miniState = ref(true)

const user = {
  id: 1,
  nome: 'Rafael Silva',
  email: '6QlR4@example.com',
  perfil: {
    id: 1,
    nome: 'Admin',
  },
  orgao: {
    id: 1,
    nome: 'Orgao',
  },
}

const menuList = [
  { label: 'Início', icon: 'fa-solid fa-house', route: 'dashboard' },
  { label: 'Pedidos', icon: 'fa-solid fa-utensils', route: 'pedidos' },
  { label: 'Produtos', icon: 'fa-solid fa-burger', route: 'produtos' },
  { label: 'Categoria', icon: 'fa-solid fa-layer-group', route: 'categorias' },
  { label: 'Ajustes', icon: 'fa-solid fa-gear', route: 'configuracoes-estabelecimento' },
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  max-width: 150px;
  margin: 0 auto;
}
</style>
