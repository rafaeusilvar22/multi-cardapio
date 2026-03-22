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

        <q-card flat bordered class="settings-card">
          <q-tabs
            v-model="activeTab"
            align="left"
            indicator-color="primary"
            active-color="primary"
            class="settings-tabs text-grey-6"
            no-caps
          >
            <q-tab name="info" icon="store" label="Informações" />
            <q-tab name="hours" icon="schedule" label="Horários" />
            <q-tab name="colors" icon="palette" label="Aparência" />
            <q-tab name="delivery" icon="delivery_dining" label="Entrega & Pagamento" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="activeTab" animated>
            <!-- ===== TAB 1 — INFORMAÇÕES ===== -->
            <q-tab-panel name="info" class="q-pa-lg">
              <q-form ref="infoFormRef" @submit="handleSaveInfo">

                <!-- Imagens -->
                <div class="section-block q-mb-xl">
                  <div class="section-title q-mb-lg">
                    <q-icon name="image" size="20px" class="q-mr-sm" />Imagens
                  </div>

                  <div class="row q-col-gutter-lg">
                    <!-- Logo -->
                    <div class="col-12 col-sm-4">
                      <div class="upload-label q-mb-sm">Logo do Estabelecimento</div>
                      <ImageUploadZone
                        :preview="infoForm.logo"
                        label="Clique ou arraste o logo"
                        hint="400 × 400 px recomendado"
                        :aspect-ratio="1"
                        @change="(file, url) => { logoFile = file; infoForm.logo = url }"
                        @remove="() => { logoFile = null; infoForm.logo = null }"
                        @error="notifyError"
                      />
                    </div>

                    <!-- Banner -->
                    <div class="col-12 col-sm-8">
                      <div class="upload-label q-mb-sm">Banner do Estabelecimento</div>
                      <ImageUploadZone
                        :preview="infoForm.banner"
                        label="Clique ou arraste o banner"
                        hint="1200 × 400 px recomendado"
                        :aspect-ratio="3"
                        @change="(file, url) => { bannerFile = file; infoForm.banner = url }"
                        @remove="() => { bannerFile = null; infoForm.banner = null }"
                        @error="notifyError"
                      />
                    </div>
                  </div>
                </div>

                <!-- Informações Básicas -->
                <div class="section-block q-mb-xl">
                  <div class="section-title q-mb-lg">
                    <q-icon name="store" size="20px" class="q-mr-sm" />Informações Básicas
                  </div>

                  <div class="row q-col-gutter-md">
                    <div class="col-12">
                      <q-input
                        v-model="infoForm.name"
                        outlined
                        label="Nome do Estabelecimento *"
                        placeholder="Ex: Restaurante do João"
                        :rules="[(val) => !!val || 'Nome é obrigatório']"
                      >
                        <template v-slot:prepend><q-icon name="business" /></template>
                      </q-input>
                    </div>

                    <div class="col-12 col-sm-6">
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
                    </div>

                    <div class="col-12 col-sm-6">
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

                    <div class="col-12">
                      <q-input
                        v-model="infoForm.about"
                        outlined
                        type="textarea"
                        label="Sobre o estabelecimento"
                        placeholder="Conte um pouco sobre a história, especialidades e diferenciais do seu estabelecimento..."
                        autogrow
                      >
                        <template v-slot:prepend><q-icon name="info" /></template>
                      </q-input>
                    </div>
                  </div>
                </div>

                <!-- Endereço -->
                <div class="section-block q-mb-lg">
                  <div class="section-title q-mb-lg">
                    <q-icon name="place" size="20px" class="q-mr-sm" />Endereço
                  </div>

                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-4">
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

                    <div class="col-12 col-sm-8">
                      <q-input
                        v-model="infoForm.address.street"
                        outlined
                        label="Rua/Avenida *"
                        placeholder="Rua das Flores"
                        :rules="[(val) => !!val || 'Rua é obrigatória']"
                      >
                        <template v-slot:prepend><q-icon name="location_on" /></template>
                      </q-input>
                    </div>

                    <div class="col-12 col-sm-3">
                      <q-input
                        v-model="infoForm.address.number"
                        outlined
                        label="Número *"
                        placeholder="123"
                        :rules="[(val) => !!val || 'Número é obrigatório']"
                      />
                    </div>

                    <div class="col-12 col-sm-5">
                      <q-input
                        v-model="infoForm.address.complement"
                        outlined
                        label="Complemento"
                        placeholder="Sala 10"
                      />
                    </div>

                    <div class="col-12 col-sm-4">
                      <q-input
                        v-model="infoForm.address.neighborhood"
                        outlined
                        label="Bairro *"
                        placeholder="Centro"
                        :rules="[(val) => !!val || 'Bairro é obrigatório']"
                      />
                    </div>

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

                <div class="row justify-end">
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
            <q-tab-panel name="hours" class="q-pa-lg">
              <div class="section-title q-mb-lg">
                <q-icon name="schedule" size="20px" class="q-mr-sm" />Horário de Funcionamento
              </div>

              <div class="q-gutter-sm">
                <div
                  v-for="day in workingHours"
                  :key="day.day"
                  class="working-hour-item"
                  :class="{ 'working-hour-item--active': day.enabled, 'working-hour-item--dark': isDark }"
                >
                  <div class="row items-center no-wrap">
                    <div class="day-checkbox-col">
                      <q-checkbox
                        v-model="day.enabled"
                        :label="day.day"
                        class="text-weight-medium"
                      />
                    </div>
                    <div class="col">
                      <div class="row q-col-gutter-sm items-center">
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
                              <q-icon name="wb_sunny" size="16px" />
                            </template>
                          </q-input>
                        </div>
                        <div class="col-auto">
                          <span class="text-grey-5 text-caption">—</span>
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
                              <q-icon name="nights_stay" size="16px" />
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
            <q-tab-panel name="colors" class="q-pa-lg">
              <div class="section-title q-mb-lg">
                <q-icon name="palette" size="20px" class="q-mr-sm" />Aparência
              </div>

              <div class="row q-col-gutter-xl">
                <!-- Formulário de cores -->
                <div class="col-12 col-md-6">
                  <div class="q-gutter-md">
                    <div
                      v-for="color in [
                        { key: 'primaryColor', label: 'Cor Primária', required: true },
                        { key: 'secondaryColor', label: 'Cor Secundária', required: false },
                        { key: 'emphasisColor', label: 'Cor de Destaque', required: false },
                      ]"
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
            </q-tab-panel>

            <!-- ===== TAB 4 — ENTREGA & PAGAMENTO ===== -->
            <q-tab-panel name="delivery" class="q-pa-lg">
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
                            Endereço não encontrado. Verifique o endereço na aba Informações.
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
import ImageUploadZone from 'src/components/ImageUploadZone.vue'

const isDark = computed(() => Dark.isActive)

defineOptions({ name: 'SettingsPage' })

const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()
const authStore = useAuthStore()

const activeTab = ref('info')
const infoFormRef = ref(null)
const logoFile = ref(null)
const bannerFile = ref(null)

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
  banner: null,
  name: '',
  description: '',
  about: '',
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
  infoForm.value.about = group.about || ''
  infoForm.value.phone = group.phone || ''
  infoForm.value.email = group.email || ''
  infoForm.value.logo = group.logo || null
  infoForm.value.banner = group.banner || null
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
    if (logoFile.value) {
      await EstablishmentService.uploadLogo(groupUuid, logoFile.value)
      logoFile.value = null
    }

    if (bannerFile.value) {
      await EstablishmentService.uploadBanner(groupUuid, bannerFile.value)
      bannerFile.value = null
    }

    await EstablishmentService.updateSettings(groupUuid, {
      group: {
        name: infoForm.value.name,
        description: infoForm.value.description,
        about: infoForm.value.about,
        phone: infoForm.value.phone,
        email: infoForm.value.email,
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
  latitude: null,
  longitude: null,
  delivery_radius_km: null,
})

const geocodeStatus = ref('idle') // 'idle' | 'loading' | 'success' | 'error'

const establishmentAddressString = computed(() => {
  const a = infoForm.value.address
  return [a.street, a.number, a.neighborhood, a.city, a.state].filter(Boolean).join(', ')
})

const geocodeEstablishmentAddress = async () => {
  const address = establishmentAddressString.value
  if (!address) return
  geocodeStatus.value = 'loading'
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&countrycodes=br`,
      { headers: { 'Accept-Language': 'pt-BR' } }
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
// ── Card geral ──────────────────────────────────────────────────────────────
.settings-card {
  border-radius: 12px;
}

.settings-tabs {
  padding: 0 8px;

  .q-tab {
    font-weight: 500;
    letter-spacing: 0.01em;
    min-height: 52px;
  }
}

// ── Seções ──────────────────────────────────────────────────────────────────
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

.section-block {
  position: relative;
}

.upload-label {
  font-size: 12px;
  font-weight: 600;
  color: #90a4ae;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// ── Upload de imagens ────────────────────────────────────────────────────────
.logo-preview-wrapper {
  width: 160px;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px dashed #e0e0e0;
  background: #fafafa;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--q-primary);
  }

  .body--dark & {
    background: #1e1e1e;
    border-color: #3a3a3a;
  }
}

.logo-preview {
  width: 100%;
  height: 100%;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.banner-preview-wrapper {
  width: 100%;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px dashed #e0e0e0;
  background: #fafafa;
  transition: border-color 0.2s;

  &:hover {
    border-color: var(--q-primary);
  }

  .body--dark & {
    background: #1e1e1e;
    border-color: #3a3a3a;
  }
}

.banner-preview {
  width: 100%;
  height: 100%;
}

.banner-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

// ── Horários ─────────────────────────────────────────────────────────────────
.day-checkbox-col {
  width: 148px;
  flex-shrink: 0;
}

.working-hour-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-left: 3px solid #e0e0e0;
  transition: all 0.2s;

  &--active {
    border-color: rgba(0, 0, 0, 0.06);
    border-left-color: var(--q-primary);
    background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.04);
  }

  &--dark {
    background: #242424;
    border-color: transparent;
    border-left-color: #3a3a3a;

    &.working-hour-item--active {
      background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.1);
      border-left-color: var(--q-primary);
    }
  }
}

// ── Cores ────────────────────────────────────────────────────────────────────
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

// ── Entrega ──────────────────────────────────────────────────────────────────
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
