<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <!-- Cabeçalho -->
        <div class="q-mb-lg">
          <div class="text-h4 text-weight-bold">Configurações</div>
          <div class="text-subtitle1 text-grey-7">
            Configure as informações e regras do estabelecimento
          </div>
        </div>

        <q-form ref="formRef" @submit="handleSubmit">
          <div class="row q-col-gutter-lg">
            <!-- Coluna Esquerda -->
            <div class="col-12 col-md-6">
              <!-- Informações Básicas -->
              <q-card class="q-mb-lg">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="store" size="24px" class="q-mr-sm" />
                    Informações Básicas
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-lg">
                  <div class="q-gutter-md">
                    <!-- Logo -->
                    <div>
                      <div class="text-subtitle2 text-weight-medium q-mb-sm">
                        Logo do Estabelecimento
                      </div>
                      <div class="text-center">
                        <div class="logo-preview-wrapper">
                          <q-img
                            v-if="form.logo"
                            :src="form.logo"
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
                                @click="form.logo = null"
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

                    <!-- Nome -->
                    <q-input
                      v-model="form.name"
                      outlined
                      label="Nome do Estabelecimento *"
                      placeholder="Ex: Restaurante do João"
                      :rules="[(val) => !!val || 'Nome é obrigatório']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="business" />
                      </template>
                    </q-input>

                    <!-- Telefone -->
                    <q-input
                      v-model="form.phone"
                      outlined
                      label="Telefone *"
                      placeholder="(47) 99999-9999"
                      mask="(##) #####-####"
                      :rules="[(val) => !!val || 'Telefone é obrigatório']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" />
                      </template>
                    </q-input>

                    <!-- Email -->
                    <q-input
                      v-model="form.email"
                      outlined
                      type="email"
                      label="E-mail"
                      placeholder="contato@restaurante.com"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" />
                      </template>
                    </q-input>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Endereço -->
              <q-card class="q-mb-lg">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="place" size="24px" class="q-mr-sm" />
                    Endereço
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-lg">
                  <div class="q-gutter-md">
                    <!-- CEP -->
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="form.address.cep"
                          outlined
                          label="CEP *"
                          placeholder="00000-000"
                          mask="#####-###"
                          :rules="[(val) => !!val || 'CEP é obrigatório']"
                        >
                          <template v-slot:prepend>
                            <q-icon name="pin_drop" />
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <!-- Rua -->
                    <q-input
                      v-model="form.address.street"
                      outlined
                      label="Rua/Avenida *"
                      placeholder="Rua das Flores"
                      :rules="[(val) => !!val || 'Rua é obrigatória']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="location_on" />
                      </template>
                    </q-input>

                    <!-- Número e Complemento -->
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-4">
                        <q-input
                          v-model="form.address.number"
                          outlined
                          label="Número *"
                          placeholder="123"
                          :rules="[(val) => !!val || 'Número é obrigatório']"
                        />
                      </div>
                      <div class="col-12 col-sm-8">
                        <q-input
                          v-model="form.address.complement"
                          outlined
                          label="Complemento"
                          placeholder="Sala 10"
                        />
                      </div>
                    </div>

                    <!-- Bairro -->
                    <q-input
                      v-model="form.address.neighborhood"
                      outlined
                      label="Bairro *"
                      placeholder="Centro"
                      :rules="[(val) => !!val || 'Bairro é obrigatório']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="domain" />
                      </template>
                    </q-input>

                    <!-- Cidade e Estado -->
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-8">
                        <q-input
                          v-model="form.address.city"
                          outlined
                          label="Cidade *"
                          placeholder="Indaial"
                          :rules="[(val) => !!val || 'Cidade é obrigatória']"
                        >
                          <template v-slot:prepend>
                            <q-icon name="location_city" />
                          </template>
                        </q-input>
                      </div>
                      <div class="col-12 col-sm-4">
                        <q-input
                          v-model="form.address.state"
                          outlined
                          label="Estado *"
                          placeholder="SC"
                          maxlength="2"
                          :rules="[(val) => !!val || 'Estado é obrigatório']"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Coluna Direita -->
            <div class="col-12 col-md-6">
              <!-- Horário de Funcionamento -->
              <q-card class="q-mb-lg">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="schedule" size="24px" class="q-mr-sm" />
                    Horário de Funcionamento
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-lg">
                  <div class="q-gutter-sm">
                    <div v-for="day in form.workingHours" :key="day.day" class="working-hour-item">
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
                </q-card-section>
              </q-card>

              <!-- Configurações de Delivery -->
              <q-card class="q-mb-lg">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="delivery_dining" size="24px" class="q-mr-sm" />
                    Configurações de Entrega
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-lg">
                  <div class="q-gutter-md">
                    <!-- Taxa de Entrega -->
                    <q-input
                      v-model.number="form.deliveryFee"
                      outlined
                      type="number"
                      step="0.01"
                      min="0"
                      label="Taxa de Entrega (R$) *"
                      placeholder="5.00"
                      :rules="[(val) => val >= 0 || 'Taxa não pode ser negativa']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_money" />
                      </template>
                      <template v-slot:hint> Digite 0 para entrega gratuita </template>
                    </q-input>

                    <!-- Tempo Médio de Preparo -->
                    <q-input
                      v-model.number="form.preparationTime"
                      outlined
                      type="number"
                      min="0"
                      label="Tempo Médio de Preparo (minutos) *"
                      placeholder="30"
                      :rules="[
                        (val) => !!val || 'Tempo é obrigatório',
                        (val) => val > 0 || 'Tempo deve ser maior que zero',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="timer" />
                      </template>
                    </q-input>

                    <!-- Pedido Mínimo -->
                    <q-input
                      v-model.number="form.minimumOrder"
                      outlined
                      type="number"
                      step="0.01"
                      min="0"
                      label="Pedido Mínimo (R$)"
                      placeholder="20.00"
                    >
                      <template v-slot:prepend>
                        <q-icon name="shopping_cart" />
                      </template>
                      <template v-slot:hint> Digite 0 para sem valor mínimo </template>
                    </q-input>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Métodos de Pagamento -->
              <q-card>
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="payments" size="24px" class="q-mr-sm" />
                    Métodos de Pagamento
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-lg">
                  <div class="text-subtitle2 text-weight-medium q-mb-md">
                    Selecione os métodos aceitos:
                  </div>

                  <div class="payment-grid">
                    <div
                      v-for="method in form.paymentMethods"
                      :key="method.id"
                      class="payment-item"
                    >
                      <q-checkbox v-model="method.enabled" class="full-width">
                        <div class="row items-center q-gutter-sm">
                          <q-icon :name="method.icon" size="24px" :color="method.color" />
                          <span class="text-weight-medium">{{ method.name }}</span>
                        </div>
                      </q-checkbox>
                    </div>
                  </div>

                  <div v-if="!hasPaymentMethod" class="text-negative text-caption q-mt-md">
                    Selecione pelo menos um método de pagamento
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Ações -->
          <div class="q-mt-lg">
            <q-card>
              <q-card-actions class="q-pa-lg">
                <q-btn
                  flat
                  label="Cancelar"
                  color="grey-7"
                  icon="close"
                  padding="10px 24px"
                  @click="handleCancel"
                />
                <q-space />
                <q-btn
                  unelevated
                  label="Salvar Configurações"
                  color="primary"
                  icon="save"
                  padding="10px 32px"
                  type="submit"
                />
              </q-card-actions>
            </q-card>
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'SettingsPage',
})

const $q = useQuasar()
const router = useRouter()

const formRef = ref(null)
const logoFile = ref(null)

const form = ref({
  logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
  name: 'Restaurante Sabor & Arte',
  phone: '(47) 99999-9999',
  email: 'contato@saborarte.com',
  address: {
    cep: '89130-000',
    street: 'Rua das Palmeiras',
    number: '120',
    complement: 'Sala 10',
    neighborhood: 'Centro',
    city: 'Indaial',
    state: 'SC',
  },
  workingHours: [
    { day: 'Segunda-feira', enabled: true, open: '08:00', close: '18:00' },
    { day: 'Terça-feira', enabled: true, open: '08:00', close: '18:00' },
    { day: 'Quarta-feira', enabled: true, open: '08:00', close: '18:00' },
    { day: 'Quinta-feira', enabled: true, open: '08:00', close: '18:00' },
    { day: 'Sexta-feira', enabled: true, open: '08:00', close: '20:00' },
    { day: 'Sábado', enabled: true, open: '09:00', close: '15:00' },
    { day: 'Domingo', enabled: false, open: '', close: '' },
  ],
  deliveryFee: 5.0,
  preparationTime: 30,
  minimumOrder: 20.0,
  paymentMethods: [
    { id: 1, name: 'Dinheiro', icon: 'money', color: 'green', enabled: true },
    { id: 2, name: 'PIX', icon: 'qr_code', color: 'teal', enabled: true },
    { id: 3, name: 'Cartão de Crédito', icon: 'credit_card', color: 'blue', enabled: true },
    { id: 4, name: 'Cartão de Débito', icon: 'credit_card', color: 'indigo', enabled: true },
    { id: 5, name: 'Vale Refeição', icon: 'receipt', color: 'orange', enabled: false },
    { id: 6, name: 'Vale Alimentação', icon: 'restaurant', color: 'deep-orange', enabled: false },
  ],
})

const hasPaymentMethod = computed(() => {
  return form.value.paymentMethods.some((method) => method.enabled)
})

const handleLogoUpload = (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.logo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  if (!hasPaymentMethod.value) {
    $q.notify({
      message: 'Selecione pelo menos um método de pagamento',
      color: 'negative',
      icon: 'error',
      position: 'top-right',
    })
    return
  }

  const isValid = await formRef.value.validate()

  if (isValid) {
    console.log('Salvando configurações:', form.value)

    $q.notify({
      message: 'Configurações salvas com sucesso!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right',
    })
  }
}

const handleCancel = () => {
  $q.dialog({
    title: 'Cancelar',
    message: 'Tem certeza que deseja cancelar? As alterações não serão salvas.',
    cancel: {
      label: 'Não',
      flat: true,
      color: 'grey-7',
    },
    ok: {
      label: 'Sim, cancelar',
      color: 'negative',
      flat: true,
    },
  }).onOk(() => {
    router.push('/')
  })
}
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
    background: #e3f2fd;
    border-color: #2196f3;
  }
}
</style>
