<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Breadcrumb -->
        <div class="q-mb-md">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="Categorias" icon="category" to="/categories" />
            <q-breadcrumbs-el
              :label="mode === 'create' ? 'Nova Categoria' : 'Editar Categoria'"
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
                  {{ mode === 'create' ? 'Adicionar Categoria' : 'Editar Categoria' }}
                </div>
                <div class="text-subtitle2" style="opacity: 0.9">
                  {{
                    mode === 'create'
                      ? 'Crie uma nova categoria para o cardápio'
                      : 'Atualize as informações da categoria'
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
              <div class="q-gutter-md">
                <!-- Nome da Categoria -->
                <q-input
                  v-model="form.name"
                  outlined
                  label="Nome da Categoria *"
                  placeholder="Ex: Hambúrgueres"
                  :rules="[(val) => !!val || 'Nome é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="label" />
                  </template>
                </q-input>

                <!-- Seleção de Ícone -->
                <div>
                  <div class="text-subtitle2 text-weight-medium q-mb-sm">Ícone *</div>
                  <div class="icon-grid">
                    <q-btn
                      v-for="icon in availableIcons"
                      :key="icon.value"
                      :unelevated="form.icon === icon.value"
                      :outline="form.icon !== icon.value"
                      :color="form.icon === icon.value ? 'primary' : 'grey-5'"
                      :text-color="form.icon === icon.value ? 'white' : 'grey-8'"
                      class="icon-btn"
                      @click="form.icon = icon.value"
                    >
                      <q-icon :name="icon.value" size="32px" />
                      <q-tooltip>{{ icon.label }}</q-tooltip>
                    </q-btn>
                  </div>
                  <div v-if="!form.icon" class="text-negative text-caption q-mt-xs">
                    Selecione um ícone
                  </div>
                </div>

                <!-- Seleção de Cor -->
                <div>
                  <div class="text-subtitle2 text-weight-medium q-mb-sm">Cor *</div>
                  <div class="color-grid">
                    <q-btn
                      v-for="color in availableColors"
                      :key="color.value"
                      round
                      :unelevated="form.color === color.value"
                      :outline="form.color !== color.value"
                      :color="color.value"
                      class="color-btn"
                      @click="form.color = color.value"
                    >
                      <q-icon
                        v-if="form.color === color.value"
                        name="check"
                        size="24px"
                        color="white"
                      />
                      <q-tooltip>{{ color.label }}</q-tooltip>
                    </q-btn>
                  </div>
                  <div v-if="!form.color" class="text-negative text-caption q-mt-xs">
                    Selecione uma cor
                  </div>
                </div>

                <!-- Preview -->
                <div class="preview-section">
                  <div class="text-subtitle2 text-weight-medium q-mb-sm">Pré-visualização</div>
                  <div class="row items-center q-gutter-md">
                    <q-avatar size="64px" :color="form.color || 'grey'" text-color="white" rounded>
                      <q-icon :name="form.icon || 'category'" size="40px" />
                    </q-avatar>
                    <div>
                      <div class="text-h6 text-weight-medium">
                        {{ form.name || 'Nome da Categoria' }}
                      </div>
                      <div class="text-caption text-grey-7">Assim ficará no cardápio</div>
                    </div>
                  </div>
                </div>

                <!-- Ordem de Exibição -->
                <q-input
                  v-model.number="form.order"
                  outlined
                  type="number"
                  label="Ordem de Exibição"
                  placeholder="Ex: 1"
                  min="1"
                  hint="Número menor aparece primeiro"
                >
                  <template v-slot:prepend>
                    <q-icon name="sort" />
                  </template>
                </q-input>

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
                          {{ form.status ? 'Categoria Ativa' : 'Categoria Inativa' }}
                        </div>
                        <div class="text-caption text-grey-7">
                          {{ form.status ? 'Visível no cardápio' : 'Oculta no cardápio' }}
                        </div>
                      </div>
                    </template>
                  </q-toggle>
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
              :label="mode === 'create' ? 'Cadastrar Categoria' : 'Atualizar Categoria'"
              color="primary"
              :icon="mode === 'create' ? 'add' : 'save'"
              padding="10px 24px"
              @click="handleSubmit"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'CategoryFormPage',
})

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const formRef = ref(null)
const mode = ref('create')

const availableIcons = [
  { label: 'Hambúrguer', value: 'lunch_dining' },
  { label: 'Pizza', value: 'local_pizza' },
  { label: 'Café/Bebidas', value: 'local_cafe' },
  { label: 'Bolo/Sobremesa', value: 'cake' },
  { label: 'Fast Food', value: 'fastfood' },
  { label: 'Salada/Vegetais', value: 'eco' },
  { label: 'Restaurante', value: 'restaurant' },
  { label: 'Comida', value: 'restaurant_menu' },
  { label: 'Bebida', value: 'local_bar' },
  { label: 'Sorvete', value: 'icecream' },
  { label: 'Sushi', value: 'ramen_dining' },
  { label: 'Churrasco', value: 'outdoor_grill' },
]

const availableColors = [
  { label: 'Laranja', value: 'orange' },
  { label: 'Vermelho', value: 'red' },
  { label: 'Azul', value: 'blue' },
  { label: 'Rosa', value: 'pink' },
  { label: 'Roxo', value: 'purple' },
  { label: 'Verde', value: 'green' },
  { label: 'Amarelo', value: 'amber' },
  { label: 'Ciano', value: 'cyan' },
  { label: 'Marrom', value: 'brown' },
  { label: 'Cinza', value: 'grey' },
]

const form = ref({
  id: null,
  name: '',
  icon: null,
  color: null,
  order: null,
  status: true,
})

onMounted(() => {
  const categoryId = route.params.id || route.query.id

  if (categoryId) {
    mode.value = 'edit'
    loadCategory(categoryId)
  } else {
    // Define ordem padrão para nova categoria
    form.value.order = 1
  }
})

const loadCategory = (id) => {
  // Simulação de dados para exemplo
  const mockCategory = {
    id: id,
    name: 'Hambúrgueres',
    icon: 'lunch_dining',
    color: 'orange',
    order: 1,
    status: true,
  }

  form.value = { ...mockCategory }
}

const handleSubmit = async () => {
  // Validações customizadas
  if (!form.value.icon) {
    $q.notify({
      message: 'Selecione um ícone para a categoria',
      color: 'negative',
      icon: 'error',
      position: 'top-right',
    })
    return
  }

  if (!form.value.color) {
    $q.notify({
      message: 'Selecione uma cor para a categoria',
      color: 'negative',
      icon: 'error',
      position: 'top-right',
    })
    return
  }

  const isValid = await formRef.value.validate()

  if (isValid) {
    console.log('Salvando categoria:', form.value)

    $q.notify({
      message:
        mode.value === 'create'
          ? 'Categoria cadastrada com sucesso!'
          : 'Categoria atualizada com sucesso!',
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right',
    })

    router.push('/categories')
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
    router.push('/categories')
  })
}
</script>

<style lang="scss" scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.icon-btn {
  height: 80px;
  width: 100%;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 12px;
}

.color-btn {
  height: 60px;
  width: 60px;
}

.preview-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 2px dashed #e0e0e0;
}

.status-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #e0e0e0;
}
</style>
