<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Breadcrumb -->
        <div class="q-mb-md">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="Produtos" icon="inventory" to="/produtos" />
            <q-breadcrumbs-el
              :label="mode === 'create' ? 'Novo Produto' : 'Editar Produto'"
              icon="edit"
            />
          </q-breadcrumbs>
        </div>

        <q-card>
          <!-- Cabeçalho -->
          <q-card-section class="bg-primary text-white">
            <div class="row items-center justify-between">
              <div>
                <div class="text-h5 text-weight-bold">
                  {{ mode === 'create' ? 'Adicionar Produto' : 'Editar Produto' }}
                </div>
                <div class="text-subtitle2" style="opacity: 0.9">
                  {{
                    mode === 'create'
                      ? 'Cadastre um novo produto no cardápio'
                      : 'Atualize as informações do produto'
                  }}
                </div>
              </div>
              <q-btn flat round icon="close" color="white" size="md" @click="handleCancel">
                <q-tooltip>Voltar</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>

          <!-- Formulário -->
          <q-card-section class="q-pa-lg">
            <q-form ref="formRef" @submit="handleSubmit">
              <div class="row q-col-gutter-lg">
                <!-- Coluna da Imagem -->
                <div class="col-12 col-md-4">
                  <div class="text-subtitle2 text-weight-medium q-mb-md">Imagem do Produto</div>

                  <ImageUploadZone
                    :preview="form.image"
                    label="Clique ou arraste a imagem"
                    hint="Foto do produto"
                    :aspect-ratio="1"
                    @change="(file, url) => { imageFile = file; form.image = url }"
                    @remove="() => { imageFile = null; form.image = null }"
                    @error="notifyError"
                  />
                </div>

                <!-- Coluna dos Dados -->
                <div class="col-12 col-md-8">
                  <div class="text-subtitle2 text-weight-medium q-mb-md">
                    Informações do Produto
                  </div>

                  <div class="q-gutter-md">
                    <!-- Nome -->
                    <q-input
                      v-model="form.name"
                      outlined
                      label="Nome do Produto *"
                      placeholder="Ex: X-Bacon"
                      :rules="[(val) => !!val || 'Nome é obrigatório']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="restaurant_menu" />
                      </template>
                    </q-input>

                    <!-- Descrição -->
                    <q-input
                      v-model="form.description"
                      outlined
                      type="textarea"
                      label="Descrição *"
                      placeholder="Descreva os ingredientes e características do produto"
                      rows="4"
                      :rules="[(val) => !!val || 'Descrição é obrigatória']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="description" />
                      </template>
                    </q-input>

                    <!-- Categoria e Preço -->
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-select
                          v-model="form.category"
                          outlined
                          label="Categoria *"
                          :options="categoryOptions"
                          emit-value
                          map-options
                          :rules="[(val) => !!val || 'Categoria é obrigatória']"
                        >
                          <template v-slot:prepend>
                            <q-icon name="category" />
                          </template>
                        </q-select>
                      </div>

                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model.number="form.price"
                          outlined
                          label="Preço (R$) *"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          :rules="[
                            (val) => (val !== null && val !== '') || 'Preço é obrigatório',
                            (val) => val > 0 || 'Preço deve ser maior que zero',
                          ]"
                        >
                          <template v-slot:prepend>
                            <q-icon name="attach_money" />
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <!-- Status -->
                    <div class="status-section">
                      <div class="text-subtitle2 text-weight-medium q-mb-sm">Disponibilidade</div>
                      <q-toggle
                        v-model="form.status"
                        color="positive"
                        size="lg"
                        checked-icon="check"
                        unchecked-icon="close"
                      >
                        <template v-slot:default>
                          <div class="q-ml-sm">
                            <div class="text-weight-medium">
                              {{ form.status ? 'Produto Ativo' : 'Produto Inativo' }}
                            </div>
                            <div class="text-caption text-grey-7">
                              {{
                                form.status ? 'Disponível no cardápio' : 'Indisponível no cardápio'
                              }}
                            </div>
                          </div>
                        </template>
                      </q-toggle>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </q-card-section>

          <!-- Ações -->
          <q-separator />
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
              :label="mode === 'create' ? 'Cadastrar Produto' : 'Atualizar Produto'"
              color="primary"
              :icon="mode === 'create' ? 'add' : 'save'"
              padding="10px 24px"
              @click="handleSubmit"
            />
          </q-card-actions>
        </q-card>

        <!-- Grupos de Adicionais (somente no modo edição) -->
        <AddonGroupsSection v-if="mode === 'edit' && productUuid" :product-uuid="productUuid" />

        <!-- Produtos Recomendados (somente no modo edição) -->
        <ProductRecommendationsSection
          v-if="mode === 'edit' && productUuid && productId"
          :product-uuid="productUuid"
          :product-id="productId"
        />

        <!-- Aviso no modo criação -->
        <q-banner v-if="mode === 'create'" class="q-mt-lg bg-blue-1 text-blue-9" rounded>
          <template v-slot:avatar>
            <q-icon name="info" color="blue-7" />
          </template>
          Grupos de adicionais e recomendações estarão disponíveis após salvar o produto.
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'
import { ProductService } from 'src/services/ProductService'
import { CategoryService } from 'src/services/CategoryService'
import AddonGroupsSection from 'src/components/AddonGroupsSection.vue'
import ProductRecommendationsSection from 'src/components/ProductRecommendationsSection.vue'
import ImageUploadZone from 'src/components/ImageUploadZone.vue'

defineOptions({
  name: 'ProductFormPage',
})

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()

const formRef = ref(null)
const imageFile = ref(null)
const mode = ref('create')
const productUuid = ref(null)
const productId = ref(null)

const categoriesRaw = ref([])

const categoryOptions = computed(() =>
  categoriesRaw.value.map((c) => ({ label: c.name, value: c.id }))
)

const form = ref({
  name: '',
  description: '',
  price: null,
  category: null,
  image: null,
  status: true,
})

onMounted(async () => {
  showLoading()
  try {
    const categoriesResp = await CategoryService.getAll()
    const cats = categoriesResp?.data?.categories || categoriesResp?.data || categoriesResp || []
    categoriesRaw.value = Array.isArray(cats) ? cats : []
  } catch {
    notifyError('Erro ao carregar categorias')
  } finally {
    hideLoading()
  }

  const uuid = route.params.uuid
  if (uuid) {
    mode.value = 'edit'
    productUuid.value = uuid
    await loadProduct(uuid)
  }
})

const loadProduct = async (uuid) => {
  showLoading()
  try {
    const resp = await ProductService.getOne(uuid)
    const prod = resp?.data?.product || resp?.data || resp
    productId.value = prod.id
    form.value = {
      name: prod.name,
      description: prod.description,
      price: Number(prod.price),
      category: prod.categories?.[0]?.id || null,
      image: prod.image_url,
      status: prod.is_available,
    }
  } catch {
    notifyError('Erro ao carregar produto')
  } finally {
    hideLoading()
  }
}

const handleSubmit = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return

  const apiData = {
    prod_name: form.value.name,
    prod_description: form.value.description,
    prod_price: form.value.price,
    prod_is_available: form.value.status,
    category_ids: form.value.category ? [form.value.category] : [],
  }

  showLoading()
  try {
    let uuid = productUuid.value

    if (mode.value === 'create') {
      const resp = await ProductService.create(apiData)
      uuid = resp?.product?.uuid
    } else {
      await ProductService.update(uuid, apiData)
    }

    if (imageFile.value && uuid) {
      await ProductService.uploadImage(uuid, imageFile.value)
    }

    notifySuccess(mode.value === 'create' ? 'Produto cadastrado com sucesso!' : 'Produto atualizado com sucesso!')
    router.push('/produtos')
  } catch {
    notifyError(
      mode.value === 'create' ? 'Erro ao cadastrar produto' : 'Erro ao atualizar produto',
    )
  } finally {
    hideLoading()
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
    router.push('/produtos')
  })
}
</script>

<style lang="scss" scoped>
.status-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #e0e0e0;

  .body--dark & {
    background: #2a2a2a;
    border-left-color: #444;
  }
}
</style>
