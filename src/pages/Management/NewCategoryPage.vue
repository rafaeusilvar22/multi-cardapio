<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Breadcrumb -->
        <div class="q-mb-md">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="Categorias" icon="category" to="/categorias" />
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

                <!-- Descrição -->
                <q-input
                  v-model="form.description"
                  outlined
                  label="Descrição"
                  placeholder="Ex: Pratos para começar"
                  type="textarea"
                  rows="3"
                >
                  <template v-slot:prepend>
                    <q-icon name="description" />
                  </template>
                </q-input>

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
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'
import { CategoryService } from 'src/services/CategoryService'

defineOptions({
  name: 'CategoryFormPage',
})

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()

const formRef = ref(null)
const mode = ref('create')
const categoryUuid = ref(null)

const form = ref({
  name: '',
  description: '',
  order: 1,
})

onMounted(async () => {
  const uuid = route.params.uuid
  if (uuid) {
    mode.value = 'edit'
    categoryUuid.value = uuid
    await loadCategory(uuid)
  }
})

const loadCategory = async (uuid) => {
  showLoading()
  try {
    const resp = await CategoryService.getOne(uuid)
    const cat = resp?.data?.category || {}
    form.value = {
      name: cat.name,
      description: cat.description || '',
      order: cat.order || 1,
    }
  } catch {
    notifyError('Erro ao carregar categoria')
  } finally {
    hideLoading()
  }
}

const handleSubmit = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return

  const payload = {
    name: form.value.name,
    description: form.value.description,
    order: form.value.order,
  }

  showLoading()
  try {
    if (mode.value === 'create') {
      await CategoryService.create(payload)
      notifySuccess('Categoria cadastrada com sucesso!')
    } else {
      await CategoryService.update(categoryUuid.value, payload)
      notifySuccess('Categoria atualizada com sucesso!')
    }
    router.push('/categorias')
  } catch {
    notifyError(
      mode.value === 'create' ? 'Erro ao cadastrar categoria' : 'Erro ao atualizar categoria',
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
    router.push('/categorias')
  })
}
</script>
