<template>
  <q-page padding>
    <div class="rs-page-header">
      <div>
        <div class="rs-page-title">Estabelecimentos</div>
        <div class="rs-page-subtitle">Gerencie todos os estabelecimentos cadastrados</div>
      </div>
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="Novo Estabelecimento"
        style="border-radius: 8px"
        :to="{ name: 'admin-workspace-create' }"
      />
    </div>

    <q-card class="rs-data-table">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <q-input
              v-model="filters.search"
              outlined
              dense
              placeholder="Buscar estabelecimento..."
              clearable
            >
              <template v-slot:prepend><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="filters.status"
              outlined
              dense
              clearable
              emit-value
              map-options
              label="Status"
              :options="statusOptions"
              @update:model-value="loadWorkspaces"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-table
          flat
          row-key="uuid"
          :rows="filteredWorkspaces"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 15 }"
          :grid="$q.screen.lt.md"
          @row-click="(_, row) => goToDetail(row.uuid)"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                dense
                :color="statusColor(props.row.status)"
                text-color="white"
                :label="props.row.status"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" auto-width>
              <q-btn flat round dense icon="chevron_right" @click.stop="goToDetail(props.row.uuid)" />
            </q-td>
          </template>

          <template v-slot:no-data>
            <div class="full-width text-center q-pa-lg text-grey-6">
              <q-icon name="store_mall_directory" size="48px" class="q-mb-sm" />
              <div>Nenhum estabelecimento encontrado</div>
            </div>
          </template>

          <template v-slot:item="props">
            <div class="q-pa-xs col-12">
              <q-card flat bordered class="cursor-pointer" @click="goToDetail(props.row.uuid)">
                <q-card-section class="q-py-sm">
                  <div class="row items-center no-wrap q-gutter-sm">
                    <q-avatar size="40px" color="primary" text-color="white" style="border-radius: 10px">
                      <q-icon name="store" size="20px" />
                    </q-avatar>
                    <div class="col">
                      <div class="text-weight-medium">{{ props.row.name }}</div>
                      <div class="text-caption text-grey-6">{{ props.row.document_number }}</div>
                    </div>
                    <div class="column items-end q-gutter-xs">
                      <q-chip dense :color="statusColor(props.row.status)" text-color="white" :label="props.row.status" size="sm" />
                      <div class="text-caption text-grey-6">{{ props.row.type_of_service }}</div>
                    </div>
                    <q-icon name="chevron_right" color="grey-5" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { AdminService } from 'src/services/AdminService'
import useNotify from 'src/composables/showNotify'

const router = useRouter()
const $q = useQuasar()
const { notifyError } = useNotify()

const loading = ref(false)
const workspaces = ref([])
const filters = ref({ search: '', status: null })

const statusOptions = [
  { label: 'Pendente', value: 'pending' },
  { label: 'Ativo', value: 'active' },
  { label: 'Inativo', value: 'inactive' },
  { label: 'Deletado', value: 'deleted' },
]

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'document_number', label: 'CNPJ', field: 'document_number', align: 'left' },
  { name: 'type_of_service', label: 'Tipo', field: 'type_of_service', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'created_at', label: 'Criado em', field: 'created_at', align: 'left', sortable: true },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

const filteredWorkspaces = computed(() => {
  const search = filters.value.search?.toLowerCase() || ''
  return workspaces.value.filter((w) => {
    if (search && !w.name?.toLowerCase().includes(search) && !w.document_number?.includes(search)) return false
    return true
  })
})

function statusColor(status) {
  const map = { active: 'positive', pending: 'warning', inactive: 'grey', deleted: 'negative' }
  return map[status] || 'grey'
}

function goToDetail(uuid) {
  router.push({ name: 'admin-workspace-detail', params: { uuid } })
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

async function loadWorkspaces() {
  loading.value = true
  try {
    const resp = await AdminService.listWorkspaces(filters.value.status)
    const list = resp?.data?.workspaces || resp?.workspaces || []
    workspaces.value = list.map((w) => ({
      uuid: w.wks_uuid,
      name: w.wks_name,
      document_number: w.wks_document_number || '-',
      type_of_service: w.wks_type_of_service || '-',
      status: w.wks_status,
      created_at: formatDate(w.wks_created_at),
    }))
  } catch (err) {
    notifyError(err?.message || 'Erro ao carregar estabelecimentos')
  } finally {
    loading.value = false
  }
}

onMounted(loadWorkspaces)
</script>
