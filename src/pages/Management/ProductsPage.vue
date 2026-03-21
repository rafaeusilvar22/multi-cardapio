<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="rs-page-header">
      <div>
        <div class="rs-page-title">Produtos do Cardápio</div>
        <div class="rs-page-subtitle">Gerencie os produtos disponíveis</div>
      </div>
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="Adicionar Produto"
        style="border-radius: 8px"
        to="produtos/novo"
      />
    </div>

    <q-card class="rs-data-table">
      <!-- Filtros -->
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4">
            <q-input
              v-model="filters.search"
              outlined
              dense
              placeholder="Buscar produto..."
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.category"
              outlined
              dense
              placeholder="Categoria"
              :options="categoryOptions"
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              v-model="filters.status"
              outlined
              dense
              placeholder="Status"
              :options="statusOptions"
              clearable
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="toggle_on" />
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-table
          flat
          row-key="uuid"
          :rows="displayedProducts"
          :columns="columns"
          v-model:pagination="pagination"
          :loading="loading"
          :rows-per-page-options="[10, 20, 50]"
          @request="onTableRequest"
        >
          <template v-slot:body-cell-image="props">
            <q-td :props="props">
              <q-avatar size="48px" color="grey-2" style="border-radius: 10px">
                <img v-if="props.value" :src="props.value" :alt="props.row.name" style="object-fit: cover" />
                <q-icon v-else name="fastfood" size="24px" color="grey-5" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="text-weight-medium">{{ props.value }}</div>
              <div class="text-caption text-grey-6 ellipsis" style="max-width: 300px">
                {{ props.row.description }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-category="props">
            <q-td :props="props">
              <q-chip
                dense
                outline
                size="sm"
                :color="getCategoryColor(props.value)"
                :label="props.value"
                style="border-radius: 20px"
              />
            </q-td>
          </template>

          <template v-slot:body-cell-price="props">
            <q-td :props="props">
              <span class="text-weight-bold text-positive">
                {{ formatCurrency(props.value) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-toggle
                :model-value="props.value"
                color="positive"
                @update:model-value="handleToggleStatus(props.row)"
                checked-icon="check"
                unchecked-icon="close"
              >
                <q-tooltip>
                  {{ props.value ? 'Ativo' : 'Inativo' }}
                </q-tooltip>
              </q-toggle>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                size="sm"
                @click="handleEditProduct(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                size="sm"
                class="q-ml-xs"
                @click="handleDeleteProduct(props.row)"
              >
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'
import { ProductService } from 'src/services/ProductService'
import { CategoryService } from 'src/services/CategoryService'
import useConfirmDialog from 'src/composables/useConfirmDialog'

defineOptions({
  name: 'ProductsPage',
})

const $q = useQuasar()
const router = useRouter()
const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()
const { confirm } = useConfirmDialog()

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const columns = [
  { name: 'image', label: 'Imagem', field: 'image', align: 'center' },
  { name: 'name', label: 'Produto', field: 'name', align: 'left', sortable: true },
  { name: 'category', label: 'Categoria', field: 'category', align: 'center', sortable: true },
  { name: 'price', label: 'Preço', field: 'price', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const statusOptions = [
  { label: 'Ativo', value: true },
  { label: 'Inativo', value: false },
]

const products = ref([])
const loading = ref(false)
const categoriesMap = ref({})

const pagination = ref({
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
})

const filters = ref({
  search: '',
  category: null,
  status: null,
})

const categoryOptions = computed(() =>
  Object.values(categoriesMap.value).map((c) => ({ label: c.name, value: c.uuid }))
)

const parseCategoryDesc = (desc) => {
  if (!desc) return {}
  try {
    return JSON.parse(desc)
  } catch {
    return {}
  }
}

const mapApiProduct = (prod) => {
  const firstCategory = prod.categories?.[0]
  const parsedDesc = firstCategory ? parseCategoryDesc(firstCategory.description) : {}
  return {
    uuid: prod.uuid,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    image: prod.image_url,
    status: prod.status === 'active',
    category: firstCategory?.name || '',
    categoryColor: parsedDesc.color || 'grey',
  }
}

const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.rowsPerPage,
    }
    if (filters.value.search) params.name = filters.value.search
    if (filters.value.category) params.category_id = filters.value.category

    const resp = await ProductService.getAll(params)
    const data = resp?.data || resp || {}
    const apiProducts = data.products || []
    products.value = (Array.isArray(apiProducts) ? apiProducts : []).map(mapApiProduct)
    pagination.value.rowsNumber = data.total || 0
  } catch {
    notifyError('Erro ao carregar produtos')
  } finally {
    loading.value = false
  }
}

const onTableRequest = async ({ pagination: { page, rowsPerPage } }) => {
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  await fetchProducts()
}

let searchTimeout = null
watch(
  () => filters.value.search,
  () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      pagination.value.page = 1
      fetchProducts()
    }, 400)
  },
)

watch(
  () => filters.value.category,
  () => {
    pagination.value.page = 1
    fetchProducts()
  },
)

// status is not supported server-side — filter the current page only
const displayedProducts = computed(() => {
  if (filters.value.status === null || filters.value.status === undefined) return products.value
  return products.value.filter((p) => p.status === filters.value.status)
})

onMounted(async () => {
  showLoading()
  try {
    const categoriesResp = await CategoryService.getAll()
    const apiCategories = categoriesResp?.data?.categories || categoriesResp?.data || categoriesResp || []
    const catMap = {}
    ;(Array.isArray(apiCategories) ? apiCategories : []).forEach((cat) => {
      const parsed = parseCategoryDesc(cat.description)
      catMap[cat.name] = {
        uuid: cat.uuid,
        name: cat.name,
        color: parsed.color || 'grey',
        icon: parsed.icon || 'category',
      }
    })
    categoriesMap.value = catMap
  } catch {
    notifyError('Erro ao carregar categorias')
  } finally {
    hideLoading()
  }
  await fetchProducts()
})

const getCategoryColor = (categoryName) => {
  return categoriesMap.value[categoryName]?.color || 'grey'
}

const handleToggleStatus = async (product) => {
  const newStatus = !product.status
  const confirmed = await confirm({
    title: newStatus ? 'Ativar produto' : 'Desativar produto',
    message: `Deseja realmente ${newStatus ? 'ativar' : 'desativar'} o produto "<b>${product.name}</b>"?`,
    okLabel: newStatus ? 'Ativar' : 'Desativar',
    okColor: newStatus ? 'positive' : 'negative',
  })
  if (!confirmed) return

  const statusStr = newStatus ? 'active' : 'inactive'
  showLoading()
  try {
    await ProductService.updateStatus(product.uuid, statusStr)
    product.status = newStatus
    notifySuccess(`Produto ${newStatus ? 'ativado' : 'desativado'} com sucesso`)
  } catch {
    notifyError('Erro ao atualizar status do produto')
  } finally {
    hideLoading()
  }
}

const handleEditProduct = (product) => {
  router.push(`/produtos/${product.uuid}`)
}

const handleDeleteProduct = (product) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Tem certeza que deseja excluir o produto "${product.name}"?`,
    cancel: {
      label: 'Cancelar',
      flat: true,
      color: 'grey-7',
    },
    ok: {
      label: 'Excluir',
      color: 'negative',
      unelevated: true,
    },
    persistent: true,
  }).onOk(async () => {
    showLoading()
    try {
      await ProductService.remove(product.uuid)
      const index = products.value.findIndex((p) => p.uuid === product.uuid)
      if (index !== -1) products.value.splice(index, 1)
      notifySuccess('Produto excluído com sucesso')
    } catch {
      notifyError('Erro ao excluir produto')
    } finally {
      hideLoading()
    }
  })
}
</script>

<style lang="scss" scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
