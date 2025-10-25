<template>
  <q-page padding>
    <div class="col-12">
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="col">
              <div class="text-h6 text-weight-medium">Produtos do Cardápio</div>
              <div class="text-caption text-grey-7">Gerencie os produtos disponíveis</div>
            </div>
            <div>
              <q-btn
                unelevated
                color="primary"
                icon="add"
                label="Adicionar Produto"
                to="produtos/novo"
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
                :options="categories"
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
            row-key="id"
            :rows="filteredProducts"
            :columns="columns"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-image="props">
              <q-td :props="props">
                <q-avatar size="50px" square>
                  <img :src="props.value" :alt="props.row.name" />
                </q-avatar>
              </q-td>
            </template>

            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="text-weight-medium">{{ props.value }}</div>
                <div class="text-caption text-grey-7 ellipsis" style="max-width: 300px">
                  {{ props.row.description }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-category="props">
              <q-td :props="props">
                <q-badge
                  :color="getCategoryColor(props.value)"
                  text-color="white"
                  :label="props.value"
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'ProductsPage',
})

const $q = useQuasar()

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

const categories = [
  { label: 'Hambúrgueres', value: 'Hambúrgueres' },
  { label: 'Pizzas', value: 'Pizzas' },
  { label: 'Bebidas', value: 'Bebidas' },
  { label: 'Sobremesas', value: 'Sobremesas' },
  { label: 'Acompanhamentos', value: 'Acompanhamentos' },
]

const statusOptions = [
  { label: 'Ativo', value: true },
  { label: 'Inativo', value: false },
]

const products = ref([
  {
    id: 1,
    name: 'X-Bacon',
    description: 'Hambúrguer artesanal com bacon crocante, queijo cheddar, alface e tomate',
    price: 28.9,
    category: 'Hambúrgueres',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    status: true,
  },
  {
    id: 2,
    name: 'Pizza Calabresa',
    description: 'Molho de tomate, mussarela, calabresa fatiada e cebola',
    price: 45.0,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    status: true,
  },
  {
    id: 3,
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná ou Fanta - 350ml',
    price: 5.5,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&h=200&fit=crop',
    status: true,
  },
  {
    id: 4,
    name: 'Batata Frita Grande',
    description: 'Porção de batata frita crocante (500g)',
    price: 18.0,
    category: 'Acompanhamentos',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=200&fit=crop',
    status: true,
  },
  {
    id: 5,
    name: 'Pudim de Leite',
    description: 'Pudim caseiro com calda de caramelo',
    price: 12.0,
    category: 'Sobremesas',
    image:
      'https://images.unsplash.com/photo-1702728109878-c61a98d80491?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    status: true,
  },
  {
    id: 6,
    name: 'X-Tudo',
    description: 'Hambúrguer completo com bacon, ovo, presunto, queijo e salada',
    price: 35.9,
    category: 'Hambúrgueres',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=200&h=200&fit=crop',
    status: true,
  },
  {
    id: 7,
    name: 'Pizza Quatro Queijos',
    description: 'Mussarela, provolone, gorgonzola e parmesão',
    price: 52.0,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
    status: false,
  },
  {
    id: 8,
    name: 'Suco Natural',
    description: 'Laranja, limão ou maracujá - 500ml',
    price: 8.0,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop',
    status: true,
  },
])

const filters = ref({
  search: '',
  category: null,
  status: null,
})

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
    )
  }

  if (filters.value.category) {
    result = result.filter((p) => p.category === filters.value.category)
  }

  if (filters.value.status !== null) {
    result = result.filter((p) => p.status === filters.value.status)
  }

  return result
})

const getCategoryColor = (category) => {
  const colors = {
    Hambúrgueres: 'orange',
    Pizzas: 'red',
    Bebidas: 'blue',
    Sobremesas: 'pink',
    Acompanhamentos: 'purple',
  }
  return colors[category] || 'grey'
}

const handleToggleStatus = (product) => {
  product.status = !product.status
  $q.notify({
    message: `Produto ${product.status ? 'ativado' : 'desativado'} com sucesso`,
    color: product.status ? 'positive' : 'orange',
    icon: product.status ? 'check_circle' : 'info',
    position: 'top-right',
    timeout: 1500,
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
