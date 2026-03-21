<template>
  <q-layout view="hHh lpR fFf">
    <q-header v-if="menuStore.group" elevated :style="{ backgroundColor: primaryColor }">
      <q-toolbar>
        <q-avatar v-if="menuStore.group.logo" size="36px" class="q-mr-sm">
          <img :src="menuStore.group.logo" :alt="menuStore.group.name" />
        </q-avatar>
        <q-toolbar-title class="text-white">
          {{ menuStore.group.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div v-if="menuStore.loading" class="flex flex-center q-pa-xl">
        <q-spinner color="primary" size="48px" />
      </div>
      <div v-else-if="menuStore.error" class="flex flex-center q-pa-xl">
        <q-banner class="bg-negative text-white" rounded>
          {{ menuStore.error }}
        </q-banner>
      </div>
      <router-view v-else />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { setCssVar } from 'quasar'
import { useMenuStore } from 'src/stores/menu'

const route = useRoute()
const menuStore = useMenuStore()

const primaryColor = computed(() => menuStore.activeCustomization?.primary_color || '#1976D2')
const secondaryColor = computed(() => menuStore.activeCustomization?.secondary_color || '#26A69A')
const emphasisColor = computed(() => menuStore.activeCustomization?.emphasis_color || '#9C27B0')

function applyColors() {
  setCssVar('primary', primaryColor.value)
  setCssVar('secondary', secondaryColor.value)
  setCssVar('accent', emphasisColor.value)
}

async function loadCustomization(slug) {
  if (!slug) return
  await menuStore.fetchCustomization(slug)
  applyColors()
}

onMounted(() => {
  loadCustomization(route.params.companySlug)
})

watch(
  () => route.params.companySlug,
  (slug) => loadCustomization(slug),
)

watch(
  () => menuStore.activeCustomization,
  () => applyColors(),
)
</script>
