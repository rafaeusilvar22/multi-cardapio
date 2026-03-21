<template>
  <q-page padding>
    <div class="rs-page-header">
      <div class="row items-center q-gutter-sm">
        <q-btn flat round dense icon="arrow_back" :to="{ name: 'admin-workspaces' }" />
        <div>
          <div class="rs-page-title">{{ workspace?.wks_name || 'Estabelecimento' }}</div>
          <div class="rs-page-subtitle">Detalhe e configurações</div>
        </div>
      </div>
      <div class="row items-center q-gutter-sm">
        <q-chip
          :color="statusColor(workspace?.wks_status)"
          text-color="white"
          :label="workspace?.wks_status"
          class="text-capitalize"
        />
        <q-btn-dropdown unelevated no-caps color="grey-3" text-color="dark" label="Alterar status" style="border-radius: 8px">
          <q-list>
            <q-item
              v-for="opt in statusOptions"
              :key="opt.value"
              clickable
              v-close-popup
              @click="changeStatus(opt.value)"
            >
              <q-item-section>
                <q-item-label>{{ opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner size="48px" color="primary" />
    </div>

    <template v-else>
      <q-tabs v-model="tab" dense align="left" class="q-mb-md">
        <q-tab name="dados" label="Dados Gerais" icon="business" />
        <q-tab name="configuracoes" label="Configurações" icon="settings" />
        <q-tab name="usuarios" label="Usuários" icon="group" />
      </q-tabs>

      <!-- TAB: Dados Gerais -->
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="dados" class="q-pa-none">
          <q-form @submit="saveData">
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-subtitle1 text-weight-medium q-mb-md">Informações do Estabelecimento</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_name" outlined dense label="Nome" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_email" outlined dense label="E-mail" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_phone" outlined dense label="Telefone" mask="(##) #####-####" unmasked-value />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_document_number" outlined dense label="CNPJ" mask="##.###.###/####-##" unmasked-value />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_type_of_service" outlined dense label="Tipo de serviço" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_domain_url" outlined dense label="Slug / Domínio" />
                  </div>
                  <div class="col-12">
                    <q-input v-model="dataForm.wks_description" outlined dense label="Descrição" type="textarea" rows="2" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-subtitle1 text-weight-medium q-mb-md">Endereço</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-4">
                    <q-input v-model="dataForm.wks_address_zipcode" outlined dense label="CEP" mask="#####-###" unmasked-value />
                  </div>
                  <div class="col-12 col-sm-8">
                    <q-input v-model="dataForm.wks_address" outlined dense label="Endereço" />
                  </div>
                  <div class="col-12 col-sm-3">
                    <q-input v-model="dataForm.wks_address_number" outlined dense label="Número" />
                  </div>
                  <div class="col-12 col-sm-5">
                    <q-input v-model="dataForm.wks_address_neighborhood" outlined dense label="Bairro" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input v-model="dataForm.wks_address_complement" outlined dense label="Complemento" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_address_city" outlined dense label="Cidade" />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="dataForm.wks_address_state" outlined dense label="Estado" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div class="row justify-end">
              <q-btn unelevated no-caps color="primary" label="Salvar Dados" type="submit" :loading="savingData" style="border-radius: 8px" />
            </div>
          </q-form>
        </q-tab-panel>

        <!-- TAB: Configurações -->
        <q-tab-panel name="configuracoes" class="q-pa-none">
          <q-form @submit="saveSettings">
            <q-card class="q-mb-md">
              <q-card-section>
                <div class="text-subtitle1 text-weight-medium q-mb-md">Entrega e Pagamentos</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-toggle v-model="settingsForm.delivery_enabled" label="Delivery habilitado" />
                  </div>
                  <div class="col-12 col-sm-4">
                    <CurrencyInput
                      v-model="settingsForm.delivery_fee"
                      outlined
                      dense
                      label="Taxa de entrega"
                    />
                  </div>
                  <div class="col-12 col-sm-4">
                    <CurrencyInput
                      v-model="settingsForm.min_order_amount"
                      outlined
                      dense
                      label="Pedido mínimo"
                    />
                  </div>
                  <div class="col-12 col-sm-4">
                    <q-input
                      v-model.number="settingsForm.avg_preparation_time"
                      outlined
                      dense
                      label="Tempo médio de preparo (min)"
                      type="number"
                      min="1"
                      suffix="min"
                    />
                  </div>
                  <div class="col-12">
                    <q-select
                      v-model="settingsForm.accepted_payment_methods"
                      outlined
                      dense
                      multiple
                      emit-value
                      map-options
                      use-chips
                      label="Métodos de pagamento aceitos"
                      :options="paymentMethodOptions"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div class="row justify-end">
              <q-btn unelevated no-caps color="primary" label="Salvar Configurações" type="submit" :loading="savingSettings" style="border-radius: 8px" />
            </div>
          </q-form>
        </q-tab-panel>

        <!-- TAB: Usuários -->
        <q-tab-panel name="usuarios" class="q-pa-none">
          <q-card>
            <q-card-section class="q-pa-none">
              <q-table
                flat
                row-key="use_uuid"
                :rows="users"
                :columns="userColumns"
                :loading="loadingUsers"
                :pagination="{ rowsPerPage: 10 }"
                :grid="$q.screen.lt.md"
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip dense :color="userStatusColor(props.row.use_status)" text-color="white" :label="props.row.use_status" />
                  </q-td>
                </template>
                <template v-slot:no-data>
                  <div class="full-width text-center q-pa-lg text-grey-6">Nenhum usuário encontrado</div>
                </template>

                <template v-slot:item="props">
                  <div class="q-pa-xs col-12">
                    <q-card flat bordered>
                      <q-card-section class="q-py-sm">
                        <div class="row items-center no-wrap q-gutter-sm">
                          <q-avatar size="38px" color="primary" text-color="white">
                            {{ (props.row.use_first_name?.[0] || '?').toUpperCase() }}
                          </q-avatar>
                          <div class="col">
                            <div class="text-weight-medium">{{ props.row.use_first_name }} {{ props.row.use_last_name }}</div>
                            <div class="text-caption text-grey-6">{{ props.row.use_email }}</div>
                            <div class="text-caption text-grey-6">{{ props.row.use_type }}</div>
                          </div>
                          <q-chip dense :color="userStatusColor(props.row.use_status)" text-color="white" :label="props.row.use_status" size="sm" />
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { AdminService } from 'src/services/AdminService'
import useNotify from 'src/composables/showNotify'
import CurrencyInput from 'src/components/CurrencyInput.vue'

const route = useRoute()
const $q = useQuasar()
const { notifySuccess, notifyError } = useNotify()

const loading = ref(false)
const savingData = ref(false)
const savingSettings = ref(false)
const loadingUsers = ref(false)
const tab = ref('dados')
const workspace = ref(null)
const users = ref([])

const statusOptions = [
  { label: 'Ativar', value: 'active' },
  { label: 'Inativar', value: 'inactive' },
  { label: 'Deletar', value: 'deleted' },
]

const paymentMethodOptions = [
  { label: 'Dinheiro', value: 'cash' },
  { label: 'Cartão de Crédito', value: 'credit_card' },
  { label: 'Cartão de Débito', value: 'debit_card' },
  { label: 'PIX', value: 'pix' },
]

const userColumns = [
  { name: 'use_first_name', label: 'Nome', field: (r) => `${r.use_first_name} ${r.use_last_name || ''}`.trim(), align: 'left' },
  { name: 'use_email', label: 'E-mail', field: 'use_email', align: 'left' },
  { name: 'use_type', label: 'Tipo', field: 'use_type', align: 'left' },
  { name: 'status', label: 'Status', field: 'use_status', align: 'center' },
]

const dataForm = ref({})
const settingsForm = ref({
  delivery_enabled: false,
  delivery_fee: null,
  min_order_amount: null,
  avg_preparation_time: null,
  accepted_payment_methods: [],
})

function statusColor(status) {
  const map = { active: 'positive', pending: 'warning', inactive: 'grey', deleted: 'negative' }
  return map[status] || 'grey'
}

function userStatusColor(status) {
  const map = { active: 'positive', inactive: 'grey', blocked: 'negative', deleted: 'negative' }
  return map[status] || 'grey'
}

function fillForms(w) {
  dataForm.value = {
    wks_name: w.wks_name || '',
    wks_email: w.wks_email || '',
    wks_phone: w.wks_phone || '',
    wks_document_number: w.wks_document_number || '',
    wks_type_of_service: w.wks_type_of_service || '',
    wks_domain_url: w.wks_domain_url || '',
    wks_description: w.wks_description || '',
    wks_address: w.wks_address || '',
    wks_address_number: w.wks_address_number || '',
    wks_address_complement: w.wks_address_complement || '',
    wks_address_neighborhood: w.wks_address_neighborhood || '',
    wks_address_city: w.wks_address_city || '',
    wks_address_state: w.wks_address_state || '',
    wks_address_zipcode: w.wks_address_zipcode || '',
  }
  settingsForm.value = {
    delivery_enabled: !!w.wks_delivery_enabled,
    delivery_fee: w.wks_delivery_fee ?? null,
    min_order_amount: w.wks_min_order_amount ?? null,
    avg_preparation_time: w.wks_avg_preparation_time ?? null,
    accepted_payment_methods: w.wks_accepted_payment_methods || [],
  }
}

async function loadWorkspace() {
  loading.value = true
  try {
    const resp = await AdminService.getWorkspace(route.params.uuid)
    const w = resp?.data?.workspace || resp?.workspace
    workspace.value = w
    fillForms(w)
  } catch (err) {
    notifyError(err?.message || 'Erro ao carregar estabelecimento')
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  loadingUsers.value = true
  try {
    const resp = await AdminService.listWorkspaceUsers(route.params.uuid)
    users.value = resp?.data?.users || resp?.users || []
  } catch (err) {
    notifyError(err?.message || 'Erro ao carregar usuários')
  } finally {
    loadingUsers.value = false
  }
}

async function saveData() {
  savingData.value = true
  try {
    const resp = await AdminService.updateWorkspace(route.params.uuid, dataForm.value)
    const w = resp?.data?.workspace || resp?.workspace
    if (w) workspace.value = { ...workspace.value, ...w }
    notifySuccess('Dados atualizados com sucesso!')
  } catch (err) {
    notifyError(err?.message || 'Erro ao salvar dados')
  } finally {
    savingData.value = false
  }
}

async function saveSettings() {
  savingSettings.value = true
  try {
    await AdminService.updateWorkspaceSettings(route.params.uuid, {
      delivery_and_payment: settingsForm.value,
    })
    notifySuccess('Configurações atualizadas com sucesso!')
  } catch (err) {
    notifyError(err?.message || 'Erro ao salvar configurações')
  } finally {
    savingSettings.value = false
  }
}

async function changeStatus(status) {
  try {
    await AdminService.updateWorkspaceStatus(route.params.uuid, status)
    workspace.value = { ...workspace.value, wks_status: status }
    notifySuccess('Status atualizado!')
  } catch (err) {
    notifyError(err?.message || 'Erro ao alterar status')
  }
}

watch(tab, (val) => {
  if (val === 'usuarios' && users.value.length === 0) loadUsers()
})

onMounted(loadWorkspace)
</script>
