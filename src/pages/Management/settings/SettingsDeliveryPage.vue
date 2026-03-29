<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <div class="rs-page-header q-mb-lg">
          <div>
            <div class="text-caption text-grey-5 q-mb-xs">Configurações</div>
            <div class="rs-page-title">Entrega & Pagamento</div>
            <div class="rs-page-subtitle">Configure as opções de entrega e meios de pagamento</div>
          </div>
        </div>

        <q-card flat bordered class="settings-card q-pa-lg">
          <div class="section-title q-mb-lg">
            <q-icon name="delivery_dining" size="20px" class="q-mr-sm" />Entrega & Pagamento
          </div>

          <div class="q-gutter-md">
            <!-- Habilitar delivery -->
            <div class="toggle-row" :class="{ 'toggle-row--dark': isDark }">
              <div class="row items-center justify-between no-wrap">
                <div>
                  <div class="text-subtitle2 text-weight-medium">Habilitar Delivery</div>
                  <div class="text-caption text-grey-6 q-mt-xs">
                    Permite que clientes solicitem entregas pelo cardápio
                  </div>
                </div>
                <q-toggle
                  v-model="deliveryForm.delivery_enabled"
                  color="primary"
                  checked-icon="check"
                  unchecked-icon="close"
                />
              </div>
            </div>

            <!-- Campos numéricos em grid -->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="deliveryForm.delivery_fee"
                  outlined
                  type="number"
                  step="0.01"
                  min="0"
                  label="Taxa de Entrega (R$)"
                  placeholder="5.00"
                  :disable="!deliveryForm.delivery_enabled"
                  :rules="[(val) => val === null || val >= 0 || 'Taxa não pode ser negativa']"
                  hint="Digite 0 para entrega gratuita"
                >
                  <template v-slot:prepend><q-icon name="attach_money" /></template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="deliveryForm.avg_preparation_time"
                  outlined
                  type="number"
                  min="1"
                  label="Tempo Médio de Preparo (min)"
                  placeholder="30"
                  :rules="[(val) => val === null || val >= 1 || 'Mínimo de 1 minuto']"
                >
                  <template v-slot:prepend><q-icon name="timer" /></template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="deliveryForm.min_order_amount"
                  outlined
                  type="number"
                  step="0.01"
                  min="0"
                  label="Pedido Mínimo (R$)"
                  placeholder="20.00"
                  :rules="[(val) => val === null || val >= 0 || 'Valor não pode ser negativo']"
                  hint="Deixe em branco para sem valor mínimo"
                >
                  <template v-slot:prepend><q-icon name="shopping_cart" /></template>
                </q-input>
              </div>

              <div class="col-12 col-sm-6">
                <q-input
                  v-model.number="deliveryForm.delivery_radius_km"
                  outlined
                  type="number"
                  step="0.1"
                  min="0"
                  label="Raio de Entrega (km)"
                  placeholder="5.0"
                  :disable="!deliveryForm.delivery_enabled"
                  :rules="[(val) => val === null || val >= 0 || 'Raio não pode ser negativo']"
                  hint="Deixe em branco para sem limite de raio"
                >
                  <template v-slot:prepend><q-icon name="radar" /></template>
                </q-input>
              </div>
            </div>

            <!-- Localização do estabelecimento -->
            <div v-if="deliveryForm.delivery_enabled">
              <div class="upload-label q-mb-sm">Localização do estabelecimento</div>
              <div class="text-caption text-grey-6 q-mb-md">
                Usamos o endereço cadastrado em <strong>Informações</strong> para calcular o raio de entrega.
                Clique em "Buscar localização" para atualizar as coordenadas sempre que o endereço mudar.
              </div>

              <div class="row items-start q-col-gutter-md">
                <div class="col">
                  <q-field
                    outlined
                    label="Endereço do estabelecimento"
                    stack-label
                    readonly
                    bottom-slots
                  >
                    <template v-slot:control>
                      <div class="self-center full-width q-py-xs text-body2" :class="establishmentAddressString ? '' : 'text-grey-5'">
                        {{ establishmentAddressString || 'Nenhum endereço cadastrado em Informações' }}
                      </div>
                    </template>
                    <template v-slot:prepend><q-icon name="place" /></template>
                    <template v-slot:hint>
                      <span v-if="geocodeStatus === 'success'" class="text-positive">
                        Localização encontrada · {{ deliveryForm.latitude?.toFixed(6) }}, {{ deliveryForm.longitude?.toFixed(6) }}
                      </span>
                      <span v-else-if="geocodeStatus === 'error'" class="text-negative">
                        Endereço não encontrado. Verifique o endereço em Informações.
                      </span>
                      <span v-else-if="deliveryForm.latitude && deliveryForm.longitude" class="text-grey-6">
                        Localização salva · {{ deliveryForm.latitude?.toFixed(6) }}, {{ deliveryForm.longitude?.toFixed(6) }}
                      </span>
                      <span v-else class="text-grey-6">
                        Clique em "Buscar localização" para geocodificar
                      </span>
                    </template>
                  </q-field>
                </div>
                <div class="col-auto q-pt-sm">
                  <q-btn
                    outline
                    color="primary"
                    icon="my_location"
                    label="Buscar localização"
                    :loading="geocodeStatus === 'loading'"
                    :disable="!establishmentAddressString"
                    @click="geocodeEstablishmentAddress"
                  />
                </div>
              </div>
            </div>

            <!-- Métodos de Pagamento -->
            <div class="q-mt-sm">
              <div class="upload-label q-mb-md">Métodos de Pagamento aceitos</div>
              <div class="payment-grid">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="payment-item"
                  :class="{ 'payment-item--dark': isDark, 'payment-item--active': method.enabled }"
                  @click="method.enabled = !method.enabled"
                >
                  <div class="row items-center q-gutter-sm no-wrap">
                    <q-icon :name="method.icon" size="22px" :color="method.enabled ? method.color : 'grey-5'" />
                    <span class="text-weight-medium" :class="method.enabled ? '' : 'text-grey-6'">
                      {{ method.name }}
                    </span>
                    <q-space />
                    <q-icon
                      :name="method.enabled ? 'check_circle' : 'radio_button_unchecked'"
                      :color="method.enabled ? 'positive' : 'grey-4'"
                      size="18px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn
              unelevated
              label="Salvar Entrega & Pagamento"
              color="primary"
              icon="save"
              padding="10px 32px"
              @click="handleSaveDelivery"
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

defineOptions({ name: 'SettingsDeliveryPage' })

const isDark = computed(() => Dark.isActive)

const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()
const authStore = useAuthStore()

const deliveryForm = ref({
  delivery_enabled: false,
  delivery_fee: null,
  avg_preparation_time: null,
  min_order_amount: null,
  latitude: null,
  longitude: null,
  delivery_radius_km: null,
})

const geocodeStatus = ref('idle') // 'idle' | 'loading' | 'success' | 'error'

const establishmentAddressString = computed(() => {
  const g = authStore.group
  if (!g) return ''
  return [g.address, g.address_number, g.address_neighborhood, g.address_city, g.address_state]
    .filter(Boolean)
    .join(', ')
})

const geocodeEstablishmentAddress = async () => {
  const address = establishmentAddressString.value
  if (!address) return
  geocodeStatus.value = 'loading'
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=br`,
      { headers: { 'Accept-Language': 'pt-BR' } },
    )
    const data = await res.json()
    if (!data || data.length === 0) {
      geocodeStatus.value = 'error'
      return
    }
    deliveryForm.value.latitude = parseFloat(data[0].lat)
    deliveryForm.value.longitude = parseFloat(data[0].lon)
    geocodeStatus.value = 'success'
  } catch {
    geocodeStatus.value = 'error'
  }
}

const paymentMethods = ref([
  { id: 'cash', name: 'Dinheiro', icon: 'money', color: 'green', enabled: false },
  { id: 'pix', name: 'PIX', icon: 'qr_code', color: 'teal', enabled: false },
])

const applyDeliveryForm = (workspace) => {
  if (!workspace) return
  deliveryForm.value.delivery_enabled = workspace.delivery_enabled ?? false
  deliveryForm.value.delivery_fee = workspace.delivery_fee ?? null
  deliveryForm.value.avg_preparation_time = workspace.avg_preparation_time ?? null
  deliveryForm.value.min_order_amount = workspace.min_order_amount ?? null
  deliveryForm.value.latitude = workspace.latitude ?? null
  deliveryForm.value.longitude = workspace.longitude ?? null
  deliveryForm.value.delivery_radius_km = workspace.delivery_radius_km ?? null
  const methods = workspace.accepted_payment_methods || []
  paymentMethods.value.forEach((m) => {
    m.enabled = methods.includes(m.id)
  })
}

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

const handleSaveDelivery = async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) {
    notifyError('Grupo não identificado.')
    return
  }

  showLoading()
  try {
    await EstablishmentService.updateSettings(groupUuid, {
      delivery_and_payment: {
        delivery_enabled: deliveryForm.value.delivery_enabled,
        delivery_fee: deliveryForm.value.delivery_fee,
        avg_preparation_time: deliveryForm.value.avg_preparation_time,
        min_order_amount: deliveryForm.value.min_order_amount,
        accepted_payment_methods: paymentMethods.value.filter((m) => m.enabled).map((m) => m.id),
        latitude: deliveryForm.value.latitude,
        longitude: deliveryForm.value.longitude,
        delivery_radius_km: deliveryForm.value.delivery_radius_km,
      },
    })
    await syncStore()
    notifySuccess('Entrega & Pagamento salvos com sucesso!')
  } catch {
    notifyError('Erro ao salvar configurações de entrega')
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
    const workspace = data?.workspace || data?.group || data
    applyDeliveryForm(workspace)
  } catch {
    notifyError('Erro ao carregar configurações de entrega')
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

.toggle-row {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #eeeeee;

  &--dark {
    background: #242424;
    border-color: #3a3a3a;
  }
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.payment-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px 14px;
  border: 1.5px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: #bdbdbd;
  }

  &--active {
    background: rgba(var(--q-positive-rgb, 33, 150, 83), 0.06);
    border-color: var(--q-positive, #21a854);
  }

  &--dark {
    background: #242424;
    border-color: #3a3a3a;

    &.payment-item--active {
      background: rgba(var(--q-positive-rgb, 33, 150, 83), 0.14);
      border-color: var(--q-positive, #21a854);
    }

    &:hover {
      border-color: #555;
    }
  }
}
</style>
