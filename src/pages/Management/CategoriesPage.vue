<template>
  <q-page padding>
    <!-- Page Header -->
    <div class="rs-page-header">
      <div>
        <div class="rs-page-title">Categorias do Cardápio</div>
        <div class="rs-page-subtitle">Organize as categorias dos produtos</div>
      </div>
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="add"
        label="Adicionar Categoria"
        style="border-radius: 8px"
        @click="handleAddCategory"
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
              placeholder="Buscar categoria..."
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-none">
        <q-table
          flat
          row-key="uuid"
          :rows="filteredCategories"
          :columns="columns"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center no-wrap q-gutter-sm">
                <q-avatar
                  size="32px"
                  :color="getCategoryColor(props.row)"
                  text-color="white"
                  style="border-radius: 8px"
                >
                  <q-icon :name="getCategoryIcon(props.row)" size="16px" />
                </q-avatar>
                <div>
                  <div class="text-weight-medium">{{ props.value }}</div>
                  <div v-if="props.row.description" class="text-caption text-grey-6">
                    {{ getDescriptionText(props.row.description) }}
                  </div>
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-order="props">
            <q-td :props="props">
              <div class="row items-center no-wrap q-gutter-xs">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="keyboard_arrow_up"
                  color="primary"
                  @click="handleMoveOrder(props.row, 'up')"
                  :disable="props.rowIndex === 0"
                >
                  <q-tooltip>Mover para cima</q-tooltip>
                </q-btn>
                <span class="text-weight-medium q-px-xs">{{ props.value }}</span>
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="keyboard_arrow_down"
                  color="primary"
                  @click="handleMoveOrder(props.row, 'down')"
                  :disable="props.rowIndex === filteredCategories.length - 1"
                >
                  <q-tooltip>Mover para baixo</q-tooltip>
                </q-btn>
              </div>
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
                @click="handleEditCategory(props.row)"
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
                @click="handleDeleteCategory(props.row)"
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
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'
import { CategoryService } from 'src/services/CategoryService'

defineOptions({
  name: 'CategoriesPage',
})

const $q = useQuasar()
const router = useRouter()
const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'order', label: 'Ordem', field: 'order', align: 'center', sortable: true },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const categories = ref([])

onMounted(async () => {
  showLoading()
  try {
    const resp = await CategoryService.getAll()
    categories.value = resp?.data?.categories || []
  } catch {
    notifyError('Erro ao carregar categorias')
  } finally {
    hideLoading()
  }
})

const filters = ref({
  search: '',
})

const filteredCategories = computed(() => {
  let result = [...categories.value].sort((a, b) => a.order - b.order)

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter((c) => c.name.toLowerCase().includes(search))
  }

  return result
})

const parseDesc = (desc) => {
  if (!desc) return {}
  try { return JSON.parse(desc) } catch { return {} }
}

const getCategoryColor = (row) => parseDesc(row.description).color || 'grey-5'
const getCategoryIcon = (row) => parseDesc(row.description).icon || 'category'
const getDescriptionText = (desc) => {
  const parsed = parseDesc(desc)
  return parsed.text || ''
}

const handleAddCategory = () => {
  router.push('/categorias/nova')
}

const handleEditCategory = (category) => {
  router.push(`/categorias/${category.uuid}`)
}

const handleDeleteCategory = (category) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Tem certeza que deseja excluir a categoria "${category.name}"?`,
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
      await CategoryService.remove(category.uuid)
      const index = categories.value.findIndex((c) => c.uuid === category.uuid)
      if (index !== -1) categories.value.splice(index, 1)
      notifySuccess('Categoria excluída com sucesso')
    } catch {
      notifyError('Erro ao excluir categoria')
    } finally {
      hideLoading()
    }
  })
}

const handleMoveOrder = async (category, direction) => {
  const sortedList = [...categories.value].sort((a, b) => a.order - b.order)

  // Normalize orders to unique sequential values (1, 2, 3...) before swapping
  sortedList.forEach((cat, i) => {
    cat.order = i + 1
  })

  const currentIndex = sortedList.findIndex((c) => c.uuid === category.uuid)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= sortedList.length) return

  const targetCategory = sortedList[targetIndex]
  const tempOrder = category.order
  category.order = targetCategory.order
  targetCategory.order = tempOrder

  categories.value.sort((a, b) => a.order - b.order)

  try {
    await Promise.all(
      sortedList.map((cat) => CategoryService.update(cat.uuid, { order: cat.order })),
    )
    notifySuccess('Ordem atualizada com sucesso')
  } catch {
    notifyError('Erro ao atualizar ordem')
  }
}
</script>
