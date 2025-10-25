<template>
  <q-page padding>
    <div class="col-12">
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="col">
              <div class="text-h6 text-weight-medium">Categorias do Cardápio</div>
              <div class="text-caption text-grey-7">Organize as categorias dos produtos</div>
            </div>
            <div>
              <q-btn
                unelevated
                color="primary"
                icon="add"
                label="Adicionar Categoria"
                @click="handleAddCategory"
              />
            </div>
          </div>
        </q-card-section>

        <q-separator />

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
            row-key="id"
            :rows="filteredCategories"
            :columns="columns"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-icon="props">
              <q-td :props="props">
                <q-avatar size="40px" :color="props.row.color" text-color="white" rounded>
                  <q-icon :name="props.value" size="24px" />
                </q-avatar>
              </q-td>
            </template>

            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.value }}</div>
                <div class="text-caption text-grey-7">
                  {{ props.row.products_count }} produto(s)
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
                  <span class="text-weight-medium">{{ props.value }}</span>
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
                    {{ props.value ? 'Ativa' : 'Inativa' }}
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

      <!-- Cards de Estatísticas -->
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card>
            <q-card-section>
              <div class="row items-center">
                <q-icon name="category" size="32px" color="primary" />
                <div class="col q-ml-md">
                  <div class="text-h6 text-weight-bold">{{ categories.length }}</div>
                  <div class="text-caption text-grey-7">Total de Categorias</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card>
            <q-card-section>
              <div class="row items-center">
                <q-icon name="check_circle" size="32px" color="positive" />
                <div class="col q-ml-md">
                  <div class="text-h6 text-weight-bold">{{ activeCategories }}</div>
                  <div class="text-caption text-grey-7">Categorias Ativas</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card>
            <q-card-section>
              <div class="row items-center">
                <q-icon name="inventory_2" size="32px" color="orange" />
                <div class="col q-ml-md">
                  <div class="text-h6 text-weight-bold">{{ totalProducts }}</div>
                  <div class="text-caption text-grey-7">Total de Produtos</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card>
            <q-card-section>
              <div class="row items-center">
                <q-icon name="star" size="32px" color="amber" />
                <div class="col q-ml-md">
                  <div class="text-h6 text-weight-bold">{{ mostPopularCategory }}</div>
                  <div class="text-caption text-grey-7">Mais Produtos</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'CategoriesPage',
})

const $q = useQuasar()
const router = useRouter()

const columns = [
  { name: 'icon', label: 'Ícone', field: 'icon', align: 'center' },
  { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true },
  { name: 'order', label: 'Ordem', field: 'order', align: 'center', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const categories = ref([
  {
    id: 1,
    name: 'Hambúrgueres',
    icon: 'lunch_dining',
    color: 'orange',
    order: 1,
    status: true,
    products_count: 8,
  },
  {
    id: 2,
    name: 'Pizzas',
    icon: 'local_pizza',
    color: 'red',
    order: 2,
    status: true,
    products_count: 12,
  },
  {
    id: 3,
    name: 'Bebidas',
    icon: 'local_cafe',
    color: 'blue',
    order: 3,
    status: true,
    products_count: 15,
  },
  {
    id: 4,
    name: 'Sobremesas',
    icon: 'cake',
    color: 'pink',
    order: 4,
    status: true,
    products_count: 6,
  },
  {
    id: 5,
    name: 'Acompanhamentos',
    icon: 'fastfood',
    color: 'purple',
    order: 5,
    status: true,
    products_count: 10,
  },
  {
    id: 6,
    name: 'Saladas',
    icon: 'eco',
    color: 'green',
    order: 6,
    status: false,
    products_count: 4,
  },
])

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

const activeCategories = computed(() => {
  return categories.value.filter((c) => c.status).length
})

const totalProducts = computed(() => {
  return categories.value.reduce((sum, c) => sum + c.products_count, 0)
})

const mostPopularCategory = computed(() => {
  const max = Math.max(...categories.value.map((c) => c.products_count))
  const category = categories.value.find((c) => c.products_count === max)
  return category ? category.name : '-'
})

const handleAddCategory = () => {
  router.push('/categorias/nova')
}

const handleEditCategory = (category) => {
  router.push(`/categories/edit/${category.id}`)
}

const handleDeleteCategory = (category) => {
  if (category.products_count > 0) {
    $q.dialog({
      title: 'Não é possível excluir',
      message: `A categoria "${category.name}" possui ${category.products_count} produto(s) cadastrado(s). Remova ou altere a categoria dos produtos antes de excluir.`,
      ok: {
        label: 'Entendi',
        color: 'primary',
        unelevated: true,
      },
    })
    return
  }

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
  }).onOk(() => {
    const index = categories.value.findIndex((c) => c.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
      $q.notify({
        message: 'Categoria excluída com sucesso',
        color: 'positive',
        icon: 'check_circle',
        position: 'top-right',
      })
    }
  })
}

const handleToggleStatus = (category) => {
  category.status = !category.status
  $q.notify({
    message: `Categoria ${category.status ? 'ativada' : 'desativada'} com sucesso`,
    color: category.status ? 'positive' : 'orange',
    icon: category.status ? 'check_circle' : 'info',
    position: 'top-right',
    timeout: 1500,
  })
}

const handleMoveOrder = (category, direction) => {
  const currentIndex = categories.value.findIndex((c) => c.id === category.id)
  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex >= 0 && targetIndex < categories.value.length) {
    const targetCategory = categories.value[targetIndex]

    // Troca as ordens
    const tempOrder = category.order
    category.order = targetCategory.order
    targetCategory.order = tempOrder

    // Reordena o array
    categories.value.sort((a, b) => a.order - b.order)

    $q.notify({
      message: 'Ordem atualizada com sucesso',
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right',
      timeout: 1000,
    })
  }
}
</script>
