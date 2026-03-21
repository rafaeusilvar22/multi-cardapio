<template>
  <q-page class="q-pa-md">
    <div v-if="group" class="q-gutter-y-md">
      <div class="row items-center q-gutter-x-md">
        <q-avatar v-if="group.logo" size="64px">
          <img :src="group.logo" :alt="group.name" />
        </q-avatar>
        <div>
          <div class="text-h5 text-weight-bold">{{ group.name }}</div>
          <div v-if="group.description" class="text-body2 text-grey-7">
            {{ group.description }}
          </div>
        </div>
      </div>

      <q-separator />

      <div class="row q-gutter-x-sm text-body2 text-grey-8">
        <span v-if="group.type_of_service">
          <q-icon name="delivery_dining" /> {{ group.type_of_service }}
        </span>
        <span v-if="group.phone">
          <q-icon name="phone" /> {{ group.phone }}
        </span>
        <span v-if="group.address_city">
          <q-icon name="place" /> {{ group.address_city }}, {{ group.address_state }}
        </span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useMenuStore } from 'src/stores/menu'

const menuStore = useMenuStore()
const group = computed(() => menuStore.group)
</script>
