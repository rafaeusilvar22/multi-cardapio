<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <!-- Cabeçalho -->
        <div class="rs-page-header q-mb-lg">
          <div>
            <div class="rs-page-title">Configurações</div>
            <div class="rs-page-subtitle">Configure as informações e regras do estabelecimento</div>
          </div>
        </div>

        <q-card>
          <q-tabs
            v-model="activeTab"
            dense
            align="left"
            indicator-color="primary"
            active-color="primary"
            class="text-grey-7"
          >
            <q-tab name="info" icon="store" label="Informações" />
            <q-tab name="hours" icon="schedule" label="Horários" />
            <q-tab name="colors" icon="palette" label="Aparência" />
            <q-tab name="delivery" icon="delivery_dining" label="Entrega & Pagamento" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- ===== TAB 1 — INFORMAÇÕES ===== -->
            <q-tab-panel name="info">
              <q-form ref="infoFormRef" @submit="handleSaveInfo">
                <div class="q-gutter-lg">
                  <!-- Informações Básicas -->
                  <div>
                    <div class="text-h6 text-weight-bold q-mb-md">
                      <q-icon name="store" class="q-mr-sm" />Informações Básicas
                    </div>

                    <div class="q-gutter-md">
                      <!-- Logo -->
                      <div>
                        <div class="text-subtitle2 text-weight-medium q-mb-sm">
                          Logo do Estabelecimento
                        </div>
                        <div class="text-center">
                          <div class="logo-preview-wrapper">
                            <q-img
                              v-if="infoForm.logo"
                              :src="infoForm.logo"
                              class="logo-preview"
                              fit="contain"
                            >
                              <div class="absolute-bottom-right q-pa-sm">
                                <q-btn
                                  round
                                  dense
                                  size="sm"
                                  color="negative"
                                  icon="close"
                                  @click="infoForm.logo = null"
                                >
                                  <q-tooltip>Remover logo</q-tooltip>
                                </q-btn>
                              </div>
                            </q-img>
                            <div v-else class="logo-placeholder">
                              <q-icon name="image" size="48px" color="grey-5" />
                              <div class="text-caption text-grey-6 q-mt-sm">Nenhuma logo</div>
                            </div>
                          </div>

                          <q-file
                            v-model="logoFile"
                            outlined
                            dense
                            label="Escolher logo"
                            accept="image/*"
                            @update:model-value="handleLogoUpload"
                            class="q-mt-md"
                          >
                            <template v-slot:prepend>
                              <q-icon name="cloud_upload" />
                            </template>
                          </q-file>
                          <div class="text-caption text-grey-6 q-mt-xs">
                            Formatos: PNG, JPG (Recomendado: 400x400px)
                          </div>
                        </div>
                      </div>

                      <q-input
                        v-model="infoForm.name"
                        outlined
                        label="Nome do Estabelecimento *"
                        placeholder="Ex: Restaurante do João"
                        :rules="[(val) => !!val || 'Nome é obrigatório']"
                      >
                        <template v-slot:prepend><q-icon name="business" /></template>
                      </q-input>

                      <q-input
                        v-model="infoForm.phone"
                        outlined
                        label="Telefone *"
                        placeholder="(47) 99999-9999"
                        mask="(##) #####-####"
                        :rules="[(val) => !!val || 'Telefone é obrigatório']"
                      >
                        <template v-slot:prepend><q-icon name="phone" /></template>
                      </q-input>

                      <q-input
                        v-model="infoForm.email"
                        outlined
                        type="email"
                        label="E-mail"
                        placeholder="contato@restaurante.com"
                      >
                        <template v-slot:prepend><q-icon name="email" /></template>
                      </q-input>
                    </div>
                  </div>

                  <!-- Endereço -->
                  <div>
                    <div class="text-h6 text-weight-bold q-mb-md">
                      <q-icon name="place" class="q-mr-sm" />Endereço
                    </div>

                    <div class="q-gutter-md">
                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-sm-6">
                          <q-input
                            v-model="infoForm.address.cep"
                            outlined
                            label="CEP *"
                            placeholder="00000-000"
                            mask="#####-###"
                            :rules="[(val) => !!val || 'CEP é obrigatório']"
                          >
                            <template v-slot:prepend><q-icon name="pin_drop" /></template>
                          </q-input>
                        </div>
                      </div>

                      <q-input
                        v-model="infoForm.address.street"
                        outlined
                        label="Rua/Avenida *"
                        placeholder="Rua das Flores"
                        :rules="[(val) => !!val || 'Rua é obrigatória']"
                      >
                        <template v-slot:prepend><q-icon name="location_on" /></template>
                      </q-input>

                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-sm-4">
                          <q-input
                            v-model="infoForm.address.number"
                            outlined
                            label="Número *"
                            placeholder="123"
                            :rules="[(val) => !!val || 'Número é obrigatório']"
                          />
                        </div>
                        <div class="col-12 col-sm-8">
                          <q-input
                            v-model="infoForm.address.complement"
                            outlined
                            label="Complemento"
                            placeholder="Sala 10"
                          />
                        </div>
                      </div>

                      <q-input
                        v-model="infoForm.address.neighborhood"
                        outlined
                        label="Bairro *"
                        placeholder="Centro"
                        :rules="[(val) => !!val || 'Bairro é obrigatório']"
                      >
                        <template v-slot:prepend><q-icon name="domain" /></template>
                      </q-input>

                      <div class="row q-col-gutter-md">
                        <div class="col-12 col-sm-8">
                          <q-input
                            v-model="infoForm.address.city"
                            outlined
                            label="Cidade *"
                            placeholder="Indaial"
                            :rules="[(val) => !!val || 'Cidade é obrigatória']"
                          >
                            <template v-slot:prepend><q-icon name="location_city" /></template>
                          </q-input>
                        </div>
                        <div class="col-12 col-sm-4">
                          <q-input
                            v-model="infoForm.address.state"
                            outlined
                            label="Estado *"
                            placeholder="SC"
                            maxlength="2"
                            :rules="[(val) => !!val || 'Estado é obrigatório']"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row justify-end q-mt-lg">
                  <q-btn
                    unelevated
                    label="Salvar Informações"
                    color="primary"
                    icon="save"
                    padding="10px 32px"
                    type="submit"
                  />
                </div>
              </q-form>
            </q-tab-panel>

            <!-- ===== TAB 2 — HORÁRIOS ===== -->
            <q-tab-panel name="hours">
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="schedule" class="q-mr-sm" />Horário de Funcionamento
              </div>

              <div class="q-gutter-sm">
                <div v-for="day in workingHours" :key="day.day" class="working-hour-item" :class="{ 'working-hour-item--active': day.enabled, 'working-hour-item--dark': isDark }">
                  <div class="row items-center q-gutter-md">
                    <div class="col-auto">
                      <q-checkbox
                        v-model="day.enabled"
                        :label="day.day"
                        class="text-weight-medium"
                      />
                    </div>
                    <div class="col">
                      <div class="row q-col-gutter-sm">
                        <div class="col">
                          <q-input
                            v-model="day.open"
                            outlined
                            dense
                            placeholder="08:00"
                            mask="##:##"
                            :disable="!day.enabled"
                          >
                            <template v-slot:prepend>
                              <q-icon name="access_time" size="18px" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-auto self-center">
                          <span class="text-grey-7">até</span>
                        </div>
                        <div class="col">
                          <q-input
                            v-model="day.close"
                            outlined
                            dense
                            placeholder="18:00"
                            mask="##:##"
                            :disable="!day.enabled"
                          >
                            <template v-slot:prepend>
                              <q-icon name="access_time" size="18px" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn
                  unelevated
                  label="Salvar Horários"
                  color="primary"
                  icon="save"
                  padding="10px 32px"
                  @click="handleSaveHours"
                />
              </div>
            </q-tab-panel>

            <!-- ===== TAB 3 — APARÊNCIA ===== -->
            <q-tab-panel name="colors">
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="palette" class="q-mr-sm" />Aparência
              </div>

              <div class="row q-col-gutter-lg">
                <!-- Formulário de cores -->
                <div class="col-12 col-md-6">
                  <div class="q-gutter-md">
                    <!-- Cor Primária -->
                    <div>
                      <div class="text-subtitle2 q-mb-xs">Cor Primária *</div>
                      <div class="row items-center q-gutter-sm">
                        <input type="color" v-model="colorForm.primaryColor" class="color-picker" />
                        <q-input
                          v-model="colorForm.primaryColor"
                          outlined
                          dense
                          label="Hex"
                          class="col"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <!-- Cor Secundária -->
                    <div>
                      <div class="text-subtitle2 q-mb-xs">Cor Secundária</div>
                      <div class="row items-center q-gutter-sm">
                        <input
                          type="color"
                          v-model="colorForm.secondaryColor"
                          class="color-picker"
                        />
                        <q-input
                          v-model="colorForm.secondaryColor"
                          outlined
                          dense
                          label="Hex"
                          class="col"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <!-- Cor de Destaque -->
                    <div>
                      <div class="text-subtitle2 q-mb-xs">Cor de Destaque</div>
                      <div class="row items-center q-gutter-sm">
                        <input
                          type="color"
                          v-model="colorForm.emphasisColor"
                          class="color-picker"
                        />
                        <q-input
                          v-model="colorForm.emphasisColor"
                          outlined
                          dense
                          label="Hex"
                          class="col"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Preview ao vivo -->
                <div class="col-12 col-md-6">
                  <div class="text-subtitle2 q-mb-sm">Preview</div>
                  <div class="color-preview-card">
                    <div
                      class="color-preview-header"
                      :style="{ background: colorForm.primaryColor || '#1976d2' }"
                    >
                      <span class="text-white text-weight-bold">Meu Estabelecimento</span>
                    </div>
                    <div class="color-preview-body q-pa-md">
                      <q-btn
                        unelevated
                        label="Ver Cardápio"
                        :style="{
                          background: colorForm.secondaryColor || '#26a69a',
                          color: '#fff',
                        }"
                        class="q-mb-sm"
                      />
                      <br />
                      <q-chip
                        :style="{ background: colorForm.emphasisColor || '#ff9800', color: '#fff' }"
                        label="Promoção"
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
            </q-tab-panel>

            <!-- ===== TAB 4 — ENTREGA & PAGAMENTO ===== -->
            <q-tab-panel name="delivery">
              <div class="text-h6 text-weight-bold q-mb-md">
                <q-icon name="delivery_dining" class="q-mr-sm" />Entrega & Pagamento
              </div>

              <div class="q-gutter-md">
                <!-- Habilitar delivery -->
                <div class="working-hour-item" :class="{ 'working-hour-item--dark': isDark }">
                  <div class="row items-center justify-between">
                    <div>
                      <div class="text-subtitle2 text-weight-medium">Habilitar Delivery</div>
                      <div class="text-caption text-grey-7">
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
                >
                  <template v-slot:prepend><q-icon name="attach_money" /></template>
                  <template v-slot:hint>Digite 0 para entrega gratuita</template>
                </q-input>

                <q-input
                  v-model.number="deliveryForm.avg_preparation_time"
                  outlined
                  type="number"
                  min="1"
                  label="Tempo Médio de Preparo (minutos)"
                  placeholder="30"
                  :rules="[(val) => val === null || val >= 1 || 'Mínimo de 1 minuto']"
                >
                  <template v-slot:prepend><q-icon name="timer" /></template>
                </q-input>

                <q-input
                  v-model.number="deliveryForm.min_order_amount"
                  outlined
                  type="number"
                  step="0.01"
                  min="0"
                  label="Pedido Mínimo (R$)"
                  placeholder="20.00"
                  :rules="[(val) => val === null || val >= 0 || 'Valor não pode ser negativo']"
                >
                  <template v-slot:prepend><q-icon name="shopping_cart" /></template>
                  <template v-slot:hint>Deixe em branco para sem valor mínimo</template>
                </q-input>

                <!-- Métodos de Pagamento -->
                <div>
                  <div class="text-subtitle2 text-weight-medium q-mb-md">
                    Métodos de Pagamento aceitos:
                  </div>
                  <div class="payment-grid">
                    <div
                      v-for="method in paymentMethods"
                      :key="method.id"
                      class="payment-item"
                      :class="{ 'payment-item--dark': isDark }"
                    >
                      <q-checkbox v-model="method.enabled" class="full-width">
                        <div class="row items-center q-gutter-sm">
                          <q-icon :name="method.icon" size="24px" :color="method.color" />
                          <span class="text-weight-medium">{{ method.name }}</span>
                        </div>
                      </q-checkbox>
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
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Dark } from 'quasar'
import { EstablishmentService } from 'src/services/EstablishmentService'
import { useAuthStore } from 'src/stores/auth'
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'

const isDark = computed(() => Dark.isActive)

defineOptions({ name: 'SettingsPage' })

const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()
const authStore = useAuthStore()

const activeTab = ref('info')
const infoFormRef = ref(null)
const logoFile = ref(null)

const syncStore = async () => {
  try {
    const resp = await EstablishmentService.getGroup(authStore.groupUuid)
    const data = resp?.data || resp
    const workspace = data?.workspace || data?.group || data
    if (workspace) authStore.authGroup = workspace
    if (data?.customizations) authStore.authCustomizations = data.customizations
  } catch {
    // best-effort — UI já foi atualizada pela API
  }
}

// ─── Tab 1 — Informações ────────────────────────────────────────────────────
const infoForm = ref({
  logo: null,
  name: '',
  description: '',
  phone: '',
  email: '',
  type_of_service: '',
  document_type: '',
  document_number: '',
  domain_url: '',
  address: {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  },
})

const applyGroupToForm = (group) => {
  if (!group) return
  infoForm.value.name = group.name || ''
  infoForm.value.description = group.description || ''
  infoForm.value.phone = group.phone || ''
  infoForm.value.email = group.email || ''
  infoForm.value.logo = group.logo || null
  infoForm.value.type_of_service = group.type_of_service || ''
  infoForm.value.document_type = group.document_type || ''
  infoForm.value.document_number = group.document_number || ''
  infoForm.value.domain_url = group.domain_url || ''
  infoForm.value.address.street = group.address || ''
  infoForm.value.address.number = group.address_number || ''
  infoForm.value.address.complement = group.address_complement || ''
  infoForm.value.address.neighborhood = group.address_neighborhood || ''
  infoForm.value.address.city = group.address_city || ''
  infoForm.value.address.state = group.address_state || ''
  infoForm.value.address.cep = group.address_zipcode || ''
}

const handleLogoUpload = (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      infoForm.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSaveInfo = async () => {
  const isValid = await infoFormRef.value.validate()
  if (!isValid) return

  const groupUuid = authStore.groupUuid
  if (!groupUuid) {
    notifyError('Grupo não identificado.')
    return
  }

  showLoading()
  try {
    await EstablishmentService.updateSettings(groupUuid, {
      group: {
        name: infoForm.value.name,
        description: infoForm.value.description,
        phone: infoForm.value.phone,
        email: infoForm.value.email,
        logo: infoForm.value.logo,
        type_of_service: infoForm.value.type_of_service,
        document_type: infoForm.value.document_type,
        document_number: infoForm.value.document_number,
        domain_url: infoForm.value.domain_url,
        address: infoForm.value.address.street,
        address_number: infoForm.value.address.number,
        address_complement: infoForm.value.address.complement,
        address_neighborhood: infoForm.value.address.neighborhood,
        address_city: infoForm.value.address.city,
        address_state: infoForm.value.address.state,
        address_zipcode: infoForm.value.address.cep,
      },
    })
    await syncStore()
    notifySuccess('Informações salvas com sucesso!')
  } catch {
    notifyError('Erro ao salvar informações')
  } finally {
    hideLoading()
  }
}

// ─── Tab 2 — Horários ───────────────────────────────────────────────────────
const defaultWorkingHours = () => [
  { day: 'Domingo', dayOfWeek: 0, enabled: false, open: '', close: '' },
  { day: 'Segunda-feira', dayOfWeek: 1, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Terça-feira', dayOfWeek: 2, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Quarta-feira', dayOfWeek: 3, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Quinta-feira', dayOfWeek: 4, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Sexta-feira', dayOfWeek: 5, enabled: true, open: '08:00', close: '20:00' },
  { day: 'Sábado', dayOfWeek: 6, enabled: true, open: '09:00', close: '15:00' },
]

const workingHours = ref(defaultWorkingHours())

const handleSaveHours = async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) {
    notifyError('Grupo não identificado.')
    return
  }

  showLoading()
  try {
    const business_hours = workingHours.value.map((day) => ({
      day_of_week: day.dayOfWeek,
      is_closed: !day.enabled,
      open_time: day.enabled ? day.open : null,
      close_time: day.enabled ? day.close : null,
    }))

    await EstablishmentService.updateSettings(groupUuid, { business_hours })
    await syncStore()
    notifySuccess('Horários salvos com sucesso!')
  } catch {
    notifyError('Erro ao salvar horários')
  } finally {
    hideLoading()
  }
}

// ─── Tab 3 — Aparência ──────────────────────────────────────────────────────
const toHex = (value, fallback) => (value ? value.toLowerCase() : fallback)

const storedCustomization = authStore.activeCustomization
const colorForm = ref({
  primaryColor: toHex(storedCustomization?.primary_color, '#1976d2'),
  secondaryColor: toHex(storedCustomization?.secondary_color, '#26a69a'),
  emphasisColor: toHex(storedCustomization?.emphasis_color, '#ff9800'),
})

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

// ─── Tab 4 — Entrega & Pagamento ────────────────────────────────────────────
const deliveryForm = ref({
  delivery_enabled: false,
  delivery_fee: null,
  avg_preparation_time: null,
  min_order_amount: null,
})

const paymentMethods = ref([
  { id: 'cash', name: 'Dinheiro', icon: 'money', color: 'green', enabled: false },
  { id: 'pix', name: 'PIX', icon: 'qr_code', color: 'teal', enabled: false },
  { id: 'credit_card', name: 'Cartão de Crédito', icon: 'credit_card', color: 'blue', enabled: false },
  { id: 'debit_card', name: 'Cartão de Débito', icon: 'credit_card', color: 'indigo', enabled: false },
  { id: 'other', name: 'Outro', icon: 'payments', color: 'grey', enabled: false },
])

const applyDeliveryForm = (workspace) => {
  if (!workspace) return
  deliveryForm.value.delivery_enabled = workspace.delivery_enabled ?? false
  deliveryForm.value.delivery_fee = workspace.delivery_fee ?? null
  deliveryForm.value.avg_preparation_time = workspace.avg_preparation_time ?? null
  deliveryForm.value.min_order_amount = workspace.min_order_amount ?? null
  const methods = workspace.accepted_payment_methods || []
  paymentMethods.value.forEach((m) => { m.enabled = methods.includes(m.id) })
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
        accepted_payment_methods: paymentMethods.value
          .filter((m) => m.enabled)
          .map((m) => m.id),
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

// ─── onMounted ──────────────────────────────────────────────────────────────
onMounted(async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) return

  if (authStore.group) applyGroupToForm(authStore.group)

  showLoading()
  try {
    const [groupResp, hoursResp] = await Promise.all([
      EstablishmentService.getGroup(groupUuid),
      EstablishmentService.getBusinessHours(groupUuid),
    ])

    const data = groupResp?.data || groupResp
    const workspace = data?.workspace || data?.group || data
    applyGroupToForm(workspace)
    applyDeliveryForm(workspace)

    const customizations = data?.customizations || []
    const activeCustomization =
      customizations.find((c) => c.status === 'active' && c.primary_color) || customizations.at(-1)
    if (activeCustomization) {
      colorForm.value.primaryColor = toHex(activeCustomization.primary_color, '#1976d2')
      colorForm.value.secondaryColor = toHex(activeCustomization.secondary_color, '#26a69a')
      colorForm.value.emphasisColor = toHex(activeCustomization.emphasis_color, '#ff9800')
    }

    const apiHours = hoursResp?.data || hoursResp || []
    if (Array.isArray(apiHours) && apiHours.length > 0) {
      const hours = defaultWorkingHours()
      apiHours.forEach((bh) => {
        const dayEntry = hours.find((d) => d.dayOfWeek === bh.day_of_week)
        if (dayEntry) {
          dayEntry.enabled = !bh.is_closed
          dayEntry.open = bh.open_time?.slice(0, 5) || ''
          dayEntry.close = bh.close_time?.slice(0, 5) || ''
        }
      })
      workingHours.value = hours
    }
  } catch {
    notifyError('Erro ao carregar configurações do estabelecimento')
  } finally {
    hideLoading()
  }
})
</script>

<style lang="scss" scoped>
.logo-preview-wrapper {
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 2px dashed #e0e0e0;
  background: white;
}

.logo-preview {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 10px;
}

.working-hour-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border-left: 3px solid #e0e0e0;
  transition: border-color 0.2s, background 0.2s;

  &--active {
    border-left-color: var(--q-primary);
    background: rgba(229, 57, 53, 0.04);
  }

  &--dark {
    background: #2a2a2a;
    border-left-color: #444;

    &.working-hour-item--active {
      background: rgba(229, 57, 53, 0.1);
      border-left-color: var(--q-primary);
    }
  }
}

.payment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.payment-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  border: 2px solid #e0e0e0;
  transition: all 0.2s ease;

  &:has(.q-checkbox--truthy) {
    background: rgba(229, 57, 53, 0.06);
    border-color: var(--q-primary);
  }

  &--dark {
    background: #2a2a2a;
    border-color: #444;

    &:has(.q-checkbox--truthy) {
      background: rgba(229, 57, 53, 0.15);
      border-color: var(--q-primary);
    }
  }
}

.color-picker {
  width: 48px;
  height: 48px;
  padding: 2px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.color-preview-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.color-preview-header {
  padding: 16px;
  transition: background 0.3s;
}

.color-preview-body {
  background: #fff;
}
</style>
