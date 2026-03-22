<template>
  <q-card class="q-mt-lg">
    <!-- Cabeçalho -->
    <q-card-section class="bg-grey-2 text-dark">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h6 text-weight-bold">
            <q-icon name="recommend" class="q-mr-sm" />
            Produtos Recomendados
          </div>
          <div class="text-caption text-grey-7 q-mt-xs">
            Sugira outros produtos do cardápio ao cliente (ex: bebidas, sobremesas, acompanhamentos)
          </div>
        </div>
        <q-btn
          unelevated
          color="primary"
          icon="tune"
          label="Gerenciar"
          @click="openDialog"
        />
      </div>
    </q-card-section>

    <q-separator />

    <!-- Loading -->
    <div v-if="loading" class="flex flex-center q-pa-lg">
      <q-spinner-ios color="primary" size="36px" />
    </div>

    <!-- Sem recomendações -->
    <div v-else-if="recommendations.length === 0" class="flex flex-center column q-pa-xl text-grey-6">
      <q-icon name="thumbs_up_down" size="48px" />
      <div class="q-mt-sm text-body2">Nenhuma recomendação configurada</div>
      <div class="text-caption">Clique em "Gerenciar" para selecionar produtos</div>
    </div>

    <!-- Lista de recomendações -->
    <q-card-section v-else class="q-pt-sm">
      <div class="row q-gutter-sm">
        <div
          v-for="rec in recommendations"
          :key="rec.uuid"
          class="recommendation-chip"
        >
          <q-avatar size="32px" class="q-mr-sm">
            <q-img v-if="rec.image_url" :src="rec.image_url" fit="cover" />
            <q-icon v-else name="fastfood" color="grey-5" />
          </q-avatar>
          <div>
            <div class="text-body2 text-weight-medium">{{ rec.name }}</div>
            <div class="text-caption text-primary">{{ formatPrice(rec.price) }}</div>
          </div>
          <q-btn
            flat round dense
            icon="close"
            size="xs"
            color="grey-6"
            class="q-ml-sm"
            @click="removeOne(rec)"
          >
            <q-tooltip>Remover</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>

  <!-- ── Dialog de seleção ──────────────────────────────────── -->
  <q-dialog v-model="dialog.open" maximized persistent transition-show="slide-up" transition-hide="slide-down">
    <q-card class="dialog-card">
      <!-- Header -->
      <q-card-section class="bg-primary text-white row items-center q-py-md">
        <div>
          <div class="text-h6 text-weight-bold">Gerenciar Recomendações</div>
          <div class="text-caption" style="opacity: 0.85">
            Selecione os produtos que deseja recomendar juntos com este produto
          </div>
        </div>
        <q-space />
        <q-chip
          v-if="dialog.selectedIds.size > 0"
          color="white"
          text-color="primary"
          icon="check_circle"
        >
          {{ dialog.selectedIds.size }} selecionado(s)
        </q-chip>
        <q-btn flat round icon="close" color="white" class="q-ml-sm" v-close-popup />
      </q-card-section>

      <!-- Filtro de categorias -->
      <div class="category-filter-bar q-pa-md">
        <div class="text-caption text-grey-7 q-mb-sm">Filtrar por categoria:</div>
        <div class="row q-gutter-xs">
          <q-chip
            clickable
            :color="dialog.selectedCategoryId === null ? 'primary' : 'grey-3'"
            :text-color="dialog.selectedCategoryId === null ? 'white' : 'dark'"
            icon="apps"
            @click="selectCategory(null)"
          >
            Todos
          </q-chip>
          <q-chip
            v-for="cat in dialog.categories"
            :key="cat.id"
            clickable
            :color="dialog.selectedCategoryId === cat.id ? 'primary' : 'grey-3'"
            :text-color="dialog.selectedCategoryId === cat.id ? 'white' : 'dark'"
            @click="selectCategory(cat.id)"
          >
            {{ cat.name }}
          </q-chip>
        </div>
      </div>

      <q-separator />

      <!-- Ações da categoria atual -->
      <div v-if="filteredProducts.length > 0" class="row items-center q-px-md q-py-sm bg-grey-1">
        <span class="text-caption text-grey-7">
          {{ filteredProducts.length }} produto(s) nesta categoria
        </span>
        <q-space />
        <q-btn
          flat dense
          size="sm"
          :label="allFilteredSelected ? 'Desmarcar todos' : 'Selecionar todos'"
          :color="allFilteredSelected ? 'negative' : 'primary'"
          :icon="allFilteredSelected ? 'remove_done' : 'done_all'"
          @click="toggleSelectAll"
        />
      </div>

      <!-- Lista de produtos -->
      <q-card-section class="q-pa-none" style="flex: 1; overflow-y: auto">
        <div v-if="dialog.loadingProducts" class="flex flex-center q-pa-xl">
          <q-spinner-ios color="primary" size="36px" />
        </div>

        <div v-else-if="filteredProducts.length === 0" class="flex flex-center column q-pa-xl text-grey-6">
          <q-icon name="search_off" size="48px" />
          <div class="q-mt-sm text-body2">Nenhum produto nesta categoria</div>
        </div>

        <q-list v-else separator>
          <q-item
            v-for="product in filteredProducts"
            :key="product.uuid"
            clickable
            v-ripple
            @click="toggleProduct(product.id)"
            :class="{ 'bg-blue-1': dialog.selectedIds.has(product.id) }"
          >
            <q-item-section avatar>
              <q-checkbox
                :model-value="dialog.selectedIds.has(product.id)"
                color="primary"
                @update:model-value="toggleProduct(product.id)"
                @click.stop
              />
            </q-item-section>

            <q-item-section avatar>
              <q-avatar size="48px" rounded>
                <q-img v-if="product.image_url" :src="product.image_url" fit="cover" />
                <q-icon v-else name="fastfood" size="28px" color="grey-4" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ product.name }}</q-item-label>
              <q-item-label caption class="ellipsis-2-lines">{{ product.description }}</q-item-label>
              <q-item-label>
                <div class="row q-gutter-xs q-mt-xs">
                  <q-chip
                    v-for="cat in product.categories"
                    :key="cat.id"
                    dense
                    size="sm"
                    color="grey-2"
                    text-color="grey-8"
                  >
                    {{ cat.name }}
                  </q-chip>
                </div>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="text-weight-bold text-primary">{{ formatPrice(product.price) }}</div>
              <q-badge
                :color="product.is_available ? 'positive' : 'grey'"
                :label="product.is_available ? 'Disponível' : 'Indisponível'"
                class="q-mt-xs"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <!-- Footer -->
      <q-card-actions class="q-pa-md">
        <div class="text-caption text-grey-7">
          <q-icon name="info" size="14px" /> Produtos do próprio item são excluídos automaticamente
        </div>
        <q-space />
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          label="Salvar Recomendações"
          color="primary"
          icon="save"
          :loading="dialog.saving"
          @click="handleSave"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useNotify from 'src/composables/showNotify'
import { RecommendationService } from 'src/services/RecommendationService'
import { ProductService } from 'src/services/ProductService'
import { CategoryService } from 'src/services/CategoryService'

const props = defineProps({
  productUuid: { type: String, required: true },
  productId: { type: Number, required: true },
})

const { notifySuccess, notifyError } = useNotify()

// ── State ─────────────────────────────────────────────────────

const loading = ref(false)
const recommendations = ref([])

const dialog = ref({
  open: false,
  saving: false,
  loadingProducts: false,
  categories: [],
  allProducts: [],          // all workspace products except self
  selectedCategoryId: null,
  selectedIds: new Set(),   // Set<number> of selected product IDs
})

// ── Computed ──────────────────────────────────────────────────

const filteredProducts = computed(() => {
  if (dialog.value.selectedCategoryId === null) return dialog.value.allProducts
  return dialog.value.allProducts.filter((p) =>
    p.categories?.some((c) => c.id === dialog.value.selectedCategoryId)
  )
})

const allFilteredSelected = computed(() =>
  filteredProducts.value.length > 0 &&
  filteredProducts.value.every((p) => dialog.value.selectedIds.has(p.id))
)

// ── Load ──────────────────────────────────────────────────────

const loadRecommendations = async () => {
  loading.value = true
  try {
    const resp = await RecommendationService.getRecommendations(props.productUuid)
    recommendations.value = resp?.data?.recommendations || resp?.recommendations || []
  } catch {
    notifyError('Erro ao carregar recomendações')
  } finally {
    loading.value = false
  }
}

onMounted(loadRecommendations)

// ── Helpers ───────────────────────────────────────────────────

const formatPrice = (price) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

// ── Dialog ────────────────────────────────────────────────────

const openDialog = async () => {
  // Pre-fill selected from current recommendations
  dialog.value.selectedIds = new Set(recommendations.value.map((r) => r.id))
  dialog.value.selectedCategoryId = null
  dialog.value.open = true

  // Load categories + products (once)
  if (dialog.value.allProducts.length === 0) {
    dialog.value.loadingProducts = true
    try {
      const [catsResp, prodsResp] = await Promise.all([
        CategoryService.getAll(),
        ProductService.getAll({ limit: 200 }),
      ])

      const cats = catsResp?.data?.categories || catsResp?.categories || catsResp || []
      dialog.value.categories = Array.isArray(cats) ? cats : []

      const prods = prodsResp?.data?.products || prodsResp?.products || prodsResp || []
      // Exclude the product being edited
      dialog.value.allProducts = (Array.isArray(prods) ? prods : []).filter(
        (p) => p.id !== props.productId
      )
    } catch {
      notifyError('Erro ao carregar produtos')
    } finally {
      dialog.value.loadingProducts = false
    }
  }
}

const selectCategory = (categoryId) => {
  dialog.value.selectedCategoryId = categoryId
}

const toggleProduct = (productId) => {
  const ids = new Set(dialog.value.selectedIds)
  if (ids.has(productId)) {
    ids.delete(productId)
  } else {
    ids.add(productId)
  }
  dialog.value.selectedIds = ids
}

const toggleSelectAll = () => {
  const ids = new Set(dialog.value.selectedIds)
  if (allFilteredSelected.value) {
    filteredProducts.value.forEach((p) => ids.delete(p.id))
  } else {
    filteredProducts.value.forEach((p) => ids.add(p.id))
  }
  dialog.value.selectedIds = ids
}

const handleSave = async () => {
  dialog.value.saving = true
  try {
    const productIds = [...dialog.value.selectedIds]
    const resp = await RecommendationService.syncRecommendations(props.productUuid, productIds)
    recommendations.value = resp?.data?.recommendations || resp?.recommendations || []
    dialog.value.open = false
    notifySuccess('Recomendações salvas com sucesso!')
  } catch {
    notifyError('Erro ao salvar recomendações')
  } finally {
    dialog.value.saving = false
  }
}

// ── Remove individual ─────────────────────────────────────────

const removeOne = async (rec) => {
  const remaining = recommendations.value.filter((r) => r.id !== rec.id).map((r) => r.id)
  try {
    const resp = await RecommendationService.syncRecommendations(props.productUuid, remaining)
    recommendations.value = resp?.data?.recommendations || resp?.recommendations || []
    // Keep dialog cache in sync
    dialog.value.selectedIds.delete(rec.id)
    notifySuccess('Recomendação removida')
  } catch {
    notifyError('Erro ao remover recomendação')
  }
}
</script>

<style lang="scss" scoped>
.recommendation-chip {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;

  .body--dark & {
    background: #2a2a2a;
    border-color: #444;
  }
}

.dialog-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.category-filter-bar {
  background: #fafafa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  .body--dark & {
    background: #1e1e1e;
  }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
