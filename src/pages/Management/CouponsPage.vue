<template>
  <q-page padding>
    <div class="rs-page-header">
      <div>
        <div class="rs-page-title">Cupons de Desconto</div>
        <div class="rs-page-subtitle">Crie e gerencie cupons para seus clientes</div>
      </div>
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="Novo Cupom"
        style="border-radius: 8px"
        @click="openCreate"
      />
    </div>

    <q-card class="rs-data-table">
      <q-card-section class="q-pa-none">
        <q-table
          flat
          row-key="cpn_uuid"
          :rows="coupons"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 15 }"
          :grid="$q.screen.lt.md"
        >
          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <q-chip dense :color="props.row.cpn_type === 'percentage' ? 'blue-1' : 'green-1'"
                :text-color="props.row.cpn_type === 'percentage' ? 'blue-8' : 'green-8'">
                {{ props.row.cpn_type === 'percentage'
                    ? `${props.row.cpn_value}%`
                    : formatCurrency(props.row.cpn_value) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-validity="props">
            <q-td :props="props">
              <span v-if="props.row.cpn_valid_until" class="text-caption">
                até {{ formatDate(props.row.cpn_valid_until) }}
              </span>
              <span v-else class="text-caption text-grey-5">Sem validade</span>
            </q-td>
          </template>

          <template v-slot:body-cell-uses="props">
            <q-td :props="props" class="text-center">
              <span class="text-caption">
                {{ props.row.cpn_uses_count }}
                <template v-if="props.row.cpn_max_uses"> / {{ props.row.cpn_max_uses }}</template>
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-active="props">
            <q-td :props="props">
              <q-toggle
                :model-value="props.row.cpn_is_active"
                color="positive"
                @update:model-value="toggleActive(props.row)"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" auto-width>
              <q-btn flat round dense icon="edit" color="primary" class="q-mr-xs" @click="openEdit(props.row)" />
              <q-btn flat round dense icon="delete" color="negative" @click="confirmDelete(props.row)" />
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width text-center q-pa-xl text-grey-6">
              <q-icon name="confirmation_number" size="48px" class="q-mb-sm" />
              <div>Nenhum cupom cadastrado</div>
            </div>
          </template>

          <!-- Mobile card -->
          <template v-slot:item="props">
            <div class="q-pa-xs col-12">
              <q-card flat bordered>
                <q-card-section class="q-py-sm">
                  <div class="row items-center no-wrap q-gutter-sm">
                    <div class="col">
                      <div class="text-weight-bold text-body1 text-mono">{{ props.row.cpn_code }}</div>
                      <div class="text-caption text-grey-6 q-mt-xs">
                        <q-chip dense size="sm"
                          :color="props.row.cpn_type === 'percentage' ? 'blue-1' : 'green-1'"
                          :text-color="props.row.cpn_type === 'percentage' ? 'blue-8' : 'green-8'">
                          {{ props.row.cpn_type === 'percentage'
                              ? `${props.row.cpn_value}% de desconto`
                              : `${formatCurrency(props.row.cpn_value)} de desconto` }}
                        </q-chip>
                      </div>
                      <div class="text-caption text-grey-5 q-mt-xs">
                        Usos: {{ props.row.cpn_uses_count }}{{ props.row.cpn_max_uses ? ` / ${props.row.cpn_max_uses}` : '' }}
                        <template v-if="props.row.cpn_valid_until">
                          · Até {{ formatDate(props.row.cpn_valid_until) }}
                        </template>
                      </div>
                    </div>
                    <div class="column items-end q-gutter-xs">
                      <q-toggle
                        :model-value="props.row.cpn_is_active"
                        color="positive"
                        @update:model-value="toggleActive(props.row)"
                      />
                      <div class="row q-gutter-xs">
                        <q-btn flat round dense icon="edit" color="primary" size="sm" @click="openEdit(props.row)" />
                        <q-btn flat round dense icon="delete" color="negative" size="sm" @click="confirmDelete(props.row)" />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog: criar cupom -->
    <q-dialog v-model="showCreate" persistent>
      <q-card style="min-width: 380px; max-width: 480px; width: 100%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Novo Cupom</div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="createFormRef" @submit="handleCreate">
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input
                  v-model="form.code"
                  outlined
                  dense
                  label="Código do cupom *"
                  hint="Ex: PROMO10, BEMVINDO"
                  :rules="[(v) => !!v || 'Código é obrigatório']"
                  @update:model-value="form.code = form.code.toUpperCase()"
                />
              </div>

              <div class="col-6">
                <q-select
                  v-model="form.type"
                  outlined
                  dense
                  label="Tipo *"
                  emit-value
                  map-options
                  :options="[
                    { label: 'Porcentagem (%)', value: 'percentage' },
                    { label: 'Valor fixo (R$)', value: 'fixed' },
                  ]"
                  :rules="[(v) => !!v || 'Tipo é obrigatório']"
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model.number="form.value"
                  outlined
                  dense
                  type="number"
                  min="0.01"
                  step="0.01"
                  :label="form.type === 'percentage' ? 'Percentual (%) *' : 'Valor (R$) *'"
                  :rules="[(v) => (v > 0) || 'Valor deve ser maior que 0']"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model.number="form.min_order_amount"
                  outlined
                  dense
                  type="number"
                  min="0"
                  step="0.01"
                  label="Pedido mínimo (R$)"
                  hint="Opcional — deixe vazio para sem mínimo"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model.number="form.max_uses"
                  outlined
                  dense
                  type="number"
                  min="1"
                  label="Limite total de usos"
                  hint="Opcional"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model.number="form.max_uses_per_customer"
                  outlined
                  dense
                  type="number"
                  min="1"
                  label="Usos por cliente"
                  hint="Opcional"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model="form.valid_from"
                  outlined
                  dense
                  type="date"
                  label="Válido a partir de"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model="form.valid_until"
                  outlined
                  dense
                  type="date"
                  label="Válido até"
                  clearable
                />
              </div>
            </div>

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat no-caps label="Cancelar" v-close-popup />
              <q-btn
                unelevated
                no-caps
                color="primary"
                label="Criar Cupom"
                type="submit"
                :loading="saving"
                style="border-radius: 8px"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Dialog: editar cupom -->
    <q-dialog v-model="showEdit" persistent>
      <q-card style="min-width: 380px; max-width: 480px; width: 100%">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Editar Cupom <span class="text-primary">{{ editingCoupon?.cpn_code }}</span></div>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="editFormRef" @submit="handleEdit">
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input
                  v-model.number="editForm.value"
                  outlined
                  dense
                  type="number"
                  min="0.01"
                  step="0.01"
                  :label="editForm.type === 'percentage' ? 'Percentual (%) *' : 'Valor (R$) *'"
                  :rules="[(v) => (v > 0) || 'Valor deve ser maior que 0']"
                />
              </div>

              <div class="col-12">
                <q-input
                  v-model.number="editForm.min_order_amount"
                  outlined
                  dense
                  type="number"
                  min="0"
                  step="0.01"
                  label="Pedido mínimo (R$)"
                  hint="Opcional — deixe vazio para sem mínimo"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model.number="editForm.max_uses"
                  outlined
                  dense
                  type="number"
                  min="1"
                  label="Limite total de usos"
                  hint="Opcional"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model.number="editForm.max_uses_per_customer"
                  outlined
                  dense
                  type="number"
                  min="1"
                  label="Usos por cliente"
                  hint="Opcional"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model="editForm.valid_from"
                  outlined
                  dense
                  type="date"
                  label="Válido a partir de"
                  clearable
                />
              </div>

              <div class="col-6">
                <q-input
                  v-model="editForm.valid_until"
                  outlined
                  dense
                  type="date"
                  label="Válido até"
                  clearable
                />
              </div>
            </div>

            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn flat no-caps label="Cancelar" v-close-popup />
              <q-btn
                unelevated
                no-caps
                color="primary"
                label="Salvar alterações"
                type="submit"
                :loading="saving"
                style="border-radius: 8px"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { EstablishmentService } from 'src/services/EstablishmentService'
import useNotify from 'src/composables/showNotify'

const $q = useQuasar()
const authStore = useAuthStore()
const { notifySuccess, notifyError } = useNotify()

const loading = ref(false)
const saving = ref(false)
const coupons = ref([])
const showCreate = ref(false)
const showEdit = ref(false)
const createFormRef = ref(null)
const editFormRef = ref(null)
const editingCoupon = ref(null)

const defaultForm = () => ({
  code: '',
  type: 'percentage',
  value: null,
  min_order_amount: null,
  max_uses: null,
  max_uses_per_customer: 1,
  valid_from: null,
  valid_until: null,
})

const form = ref(defaultForm())
const editForm = ref({})

const columns = [
  { name: 'code', label: 'Código', field: 'cpn_code', align: 'left', sortable: true },
  { name: 'type', label: 'Desconto', field: 'cpn_type', align: 'left' },
  { name: 'min', label: 'Pedido mín.', field: (r) => r.cpn_min_order_amount ? formatCurrency(r.cpn_min_order_amount) : '—', align: 'left' },
  { name: 'uses', label: 'Usos', field: 'cpn_uses_count', align: 'center' },
  { name: 'validity', label: 'Validade', field: 'cpn_valid_until', align: 'left' },
  { name: 'active', label: 'Ativo', field: 'cpn_is_active', align: 'center' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

function formatCurrency(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date) {
  if (!date) return '—'
  // Extract YYYY-MM-DD from ISO string or date-only string, avoiding timezone issues
  const dateStr = String(date).slice(0, 10)
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

// Converts a date value from API (ISO string) to YYYY-MM-DD for <input type="date">
function toInputDate(date) {
  if (!date) return null
  return String(date).slice(0, 10)
}

async function loadCoupons() {
  loading.value = true
  try {
    const resp = await EstablishmentService.getCoupons(authStore.groupUuid)
    coupons.value = resp?.data?.coupons ?? resp?.coupons ?? []
  } catch (err) {
    notifyError(err?.response?.data?.message || err?.message || 'Erro ao carregar cupons')
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.value = defaultForm()
  showCreate.value = true
}

function openEdit(coupon) {
  editingCoupon.value = coupon
  editForm.value = {
    type: coupon.cpn_type,
    value: Number(coupon.cpn_value),
    min_order_amount: coupon.cpn_min_order_amount ? Number(coupon.cpn_min_order_amount) : null,
    max_uses: coupon.cpn_max_uses ?? null,
    max_uses_per_customer: coupon.cpn_max_uses_per_customer ?? null,
    valid_from: toInputDate(coupon.cpn_valid_from),
    valid_until: toInputDate(coupon.cpn_valid_until),
  }
  showEdit.value = true
}

async function handleCreate() {
  saving.value = true
  try {
    const payload = {
      code: form.value.code,
      type: form.value.type,
      value: form.value.value,
      ...(form.value.min_order_amount ? { min_order_amount: form.value.min_order_amount } : {}),
      ...(form.value.max_uses ? { max_uses: form.value.max_uses } : {}),
      ...(form.value.max_uses_per_customer ? { max_uses_per_customer: form.value.max_uses_per_customer } : {}),
      ...(form.value.valid_from ? { valid_from: form.value.valid_from } : {}),
      ...(form.value.valid_until ? { valid_until: form.value.valid_until } : {}),
    }
    const resp = await EstablishmentService.createCoupon(authStore.groupUuid, payload)
    const newCoupon = resp?.data?.coupon ?? resp?.coupon
    if (newCoupon) coupons.value.unshift(newCoupon)
    showCreate.value = false
    notifySuccess('Cupom criado com sucesso!')
  } catch (err) {
    notifyError(err?.response?.data?.message || err?.message || 'Erro ao criar cupom')
  } finally {
    saving.value = false
  }
}

async function handleEdit() {
  saving.value = true
  try {
    const payload = {
      value: editForm.value.value,
      min_order_amount: editForm.value.min_order_amount || null,
      max_uses: editForm.value.max_uses || null,
      max_uses_per_customer: editForm.value.max_uses_per_customer || null,
      valid_from: editForm.value.valid_from || null,
      valid_until: editForm.value.valid_until || null,
    }
    const resp = await EstablishmentService.updateCoupon(authStore.groupUuid, editingCoupon.value.cpn_uuid, payload)
    const updated = resp?.data?.coupon ?? resp?.coupon
    if (updated) {
      const idx = coupons.value.findIndex((c) => c.cpn_uuid === updated.cpn_uuid)
      if (idx !== -1) coupons.value[idx] = updated
    }
    showEdit.value = false
    notifySuccess('Cupom atualizado!')
  } catch (err) {
    notifyError(err?.response?.data?.message || err?.message || 'Erro ao atualizar cupom')
  } finally {
    saving.value = false
  }
}

async function toggleActive(coupon) {
  try {
    await EstablishmentService.updateCoupon(authStore.groupUuid, coupon.cpn_uuid, {
      is_active: !coupon.cpn_is_active,
    })
    coupon.cpn_is_active = !coupon.cpn_is_active
  } catch (err) {
    notifyError(err?.response?.data?.message || err?.message || 'Erro ao atualizar cupom')
  }
}

function confirmDelete(coupon) {
  $q.dialog({
    title: 'Excluir cupom',
    message: `Deseja excluir o cupom <strong>${coupon.cpn_code}</strong>? Esta ação não pode ser desfeita.`,
    html: true,
    cancel: { flat: true, label: 'Cancelar' },
    ok: { unelevated: true, color: 'negative', label: 'Excluir', noCaps: true },
    persistent: true,
  }).onOk(async () => {
    try {
      await EstablishmentService.deleteCoupon(authStore.groupUuid, coupon.cpn_uuid)
      coupons.value = coupons.value.filter((c) => c.cpn_uuid !== coupon.cpn_uuid)
      notifySuccess('Cupom excluído.')
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message || 'Erro ao excluir cupom')
    }
  })
}

onMounted(loadCoupons)
</script>
