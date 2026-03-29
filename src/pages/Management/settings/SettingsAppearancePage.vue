<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <div class="rs-page-header q-mb-lg">
          <div>
            <div class="text-caption text-grey-5 q-mb-xs">Configurações</div>
            <div class="rs-page-title">Aparência</div>
            <div class="rs-page-subtitle">Personalize as cores do cardápio público</div>
          </div>
        </div>

        <q-card flat bordered class="settings-card q-pa-lg">
          <div class="section-title q-mb-lg">
            <q-icon name="palette" size="20px" class="q-mr-sm" />Aparência
          </div>

          <div class="row q-col-gutter-xl">
            <!-- Formulário de cores -->
            <div class="col-12 col-md-6">
              <div class="q-gutter-md">
                <div
                  v-for="color in colorFields"
                  :key="color.key"
                  class="color-row"
                  :class="{ 'color-row--dark': isDark }"
                >
                  <div class="color-swatch-wrapper">
                    <input
                      type="color"
                      v-model="colorForm[color.key]"
                      class="color-swatch"
                      :title="color.label"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="colorForm[color.key]"
                      outlined
                      dense
                      :label="color.label + (color.required ? ' *' : '')"
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview ao vivo -->
            <div class="col-12 col-md-6">
              <div class="upload-label q-mb-sm">Preview</div>
              <div class="color-preview-card">
                <div
                  class="color-preview-header"
                  :style="{ background: colorForm.primaryColor || '#1976d2' }"
                >
                  <q-icon name="restaurant_menu" color="white" size="20px" class="q-mr-sm" />
                  <span class="text-white text-weight-bold">Meu Estabelecimento</span>
                </div>
                <div class="color-preview-body q-pa-lg">
                  <q-btn
                    unelevated
                    label="Ver Cardápio"
                    :style="{
                      background: colorForm.secondaryColor || '#26a69a',
                      color: '#fff',
                    }"
                    class="q-mb-md"
                    rounded
                  />
                  <br />
                  <q-chip
                    :style="{ background: colorForm.emphasisColor || '#ff9800', color: '#fff' }"
                    label="Promoção"
                    icon="local_offer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn
              unelevated
              label="Salvar Aparência"
              color="primary"
              icon="save"
              padding="10px 32px"
              @click="handleSaveColors"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dark } from 'quasar'
import { EstablishmentService } from 'src/services/EstablishmentService'
import { useAuthStore } from 'src/stores/auth'
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'

defineOptions({ name: 'SettingsAppearancePage' })

const isDark = computed(() => Dark.isActive)

const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()
const authStore = useAuthStore()

const colorFields = [
  { key: 'primaryColor', label: 'Cor Primária', required: true },
  { key: 'secondaryColor', label: 'Cor Secundária', required: false },
  { key: 'emphasisColor', label: 'Cor de Destaque', required: false },
]

const toHex = (value, fallback) => (value ? value.toLowerCase() : fallback)

const colorForm = ref({
  primaryColor: toHex(authStore.activeCustomization?.primary_color, '#1976d2'),
  secondaryColor: toHex(authStore.activeCustomization?.secondary_color, '#26a69a'),
  emphasisColor: toHex(authStore.activeCustomization?.emphasis_color, '#ff9800'),
})

const syncStore = async () => {
  try {
    const resp = await EstablishmentService.getGroup(authStore.groupUuid)
    const data = resp?.data || resp
    const workspace = data?.workspace || data?.group || data
    if (workspace) authStore.authGroup = workspace
    if (data?.customizations) authStore.authCustomizations = data.customizations
  } catch {
    // best-effort
  }
}

const handleSaveColors = async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) {
    notifyError('Grupo não identificado.')
    return
  }

  if (!colorForm.value.primaryColor) {
    notifyError('Cor primária é obrigatória')
    return
  }

  showLoading()
  try {
    await EstablishmentService.updateSettings(groupUuid, {
      customization: {
        primary_color: colorForm.value.primaryColor,
        secondary_color: colorForm.value.secondaryColor || null,
        emphasis_color: colorForm.value.emphasisColor || null,
      },
    })
    await syncStore()
    notifySuccess('Aparência salva com sucesso!')
  } catch {
    notifyError('Erro ao salvar aparência')
  } finally {
    hideLoading()
  }
}

onMounted(async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) return

  showLoading()
  try {
    const resp = await EstablishmentService.getGroup(groupUuid)
    const data = resp?.data || resp
    const customizations = data?.customizations || []
    const activeCustomization =
      customizations.find((c) => c.status === 'active' && c.primary_color) || customizations.at(-1)
    if (activeCustomization) {
      colorForm.value.primaryColor = toHex(activeCustomization.primary_color, '#1976d2')
      colorForm.value.secondaryColor = toHex(activeCustomization.secondary_color, '#26a69a')
      colorForm.value.emphasisColor = toHex(activeCustomization.emphasis_color, '#ff9800')
    }
  } catch {
    notifyError('Erro ao carregar configurações de aparência')
  } finally {
    hideLoading()
  }
})
</script>

<style lang="scss" scoped>
.settings-card {
  border-radius: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--q-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  .body--dark & {
    border-color: rgba(255, 255, 255, 0.08);
    color: var(--q-primary);
  }
}

.upload-label {
  font-size: 12px;
  font-weight: 600;
  color: #90a4ae;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px;
  border: 1px solid #eeeeee;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--q-primary);
  }

  &--dark {
    background: #242424;
    border-color: #3a3a3a;
  }
}

.color-swatch-wrapper {
  flex-shrink: 0;
}

.color-swatch {
  width: 44px;
  height: 44px;
  padding: 3px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  background: none;
  display: block;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
}

.color-preview-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;

  .body--dark & {
    border-color: #3a3a3a;
  }
}

.color-preview-header {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  transition: background 0.3s;
}

.color-preview-body {
  background: #fafafa;
  min-height: 100px;

  .body--dark & {
    background: #1e1e1e;
  }
}
</style>
