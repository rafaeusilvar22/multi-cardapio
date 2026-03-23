<template>
  <q-card class="q-mt-lg">
    <!-- Cabeçalho -->
    <q-card-section class="bg-grey-2 text-dark">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h6 text-weight-bold">
            <q-icon name="tune" class="q-mr-sm" />
            Opções de Montagem
          </div>
          <div class="text-caption text-grey-7 q-mt-xs">
            Configure as opções de montagem para este produto (ex: Meio Calabresa, Meio Frango, Base Morango)
          </div>
        </div>
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Nova Opção"
          @click="openFlavorDialog()"
        />
      </div>
    </q-card-section>

    <q-separator />

    <!-- Loading -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-ios color="primary" size="40px" />
    </div>

    <!-- Sem opções -->
    <div v-else-if="flavors.length === 0" class="flex flex-center column q-pa-xl text-grey-6">
      <q-icon name="tune" size="56px" />
      <div class="q-mt-md text-body2">Nenhuma opção cadastrada</div>
      <div class="text-caption">Clique em "Nova Opção" para começar</div>
    </div>

    <!-- Lista de opções -->
    <q-list v-else separator>
      <q-expansion-item
        v-for="flavor in flavors"
        :key="flavor.uuid"
        expand-separator
        :default-opened="false"
        class="flavor-item"
      >
        <!-- Cabeçalho da opção -->
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="tune" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">{{ flavor.name }}</q-item-label>
            <q-item-label caption>
              <span class="text-primary q-mr-sm">{{ formatPrice(flavor.price) }}</span>
              <span class="text-grey-7 q-mr-sm">
                {{ flavor.ingredients?.length || 0 }} ingrediente(s)
              </span>
              <span v-if="flavor.max_qty > 0" class="text-orange-8">
                máx {{ flavor.max_qty }}×
              </span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-xs" @click.stop>
              <q-toggle
                :model-value="flavor.is_available"
                color="positive"
                size="sm"
                dense
                @update:model-value="(val) => handleToggleFlavor(flavor, val)"
              >
                <q-tooltip>{{ flavor.is_available ? 'Disponível' : 'Indisponível' }}</q-tooltip>
              </q-toggle>
              <q-btn flat round dense icon="edit" color="grey-7" @click="openFlavorDialog(flavor)">
                <q-tooltip>Editar opção</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="delete" color="negative" @click="handleDeleteFlavor(flavor)">
                <q-tooltip>Remover opção</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </template>

        <!-- Conteúdo expandido: ingredientes -->
        <div class="q-px-md q-pb-md">
          <div class="text-caption text-grey-7 q-mb-sm">Ingredientes</div>

          <!-- Sem ingredientes -->
          <div v-if="!flavor.ingredients || flavor.ingredients.length === 0" class="text-grey-6 text-caption q-py-sm">
            Nenhum ingrediente cadastrado
          </div>

          <!-- Lista de ingredientes -->
          <q-list v-else dense separator class="rounded-borders bordered q-mb-md">
            <q-item v-for="ingredient in flavor.ingredients" :key="ingredient.uuid" class="q-py-sm">
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ ingredient.name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center q-gutter-xs">
                  <q-btn
                    flat round dense icon="edit" color="grey-7"
                    @click="openIngredientDialog(flavor, ingredient)"
                  >
                    <q-tooltip>Editar ingrediente</q-tooltip>
                  </q-btn>
                  <q-btn
                    flat round dense icon="delete" color="negative"
                    @click="handleDeleteIngredient(flavor, ingredient)"
                  >
                    <q-tooltip>Remover ingrediente</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Botão adicionar ingrediente -->
          <q-btn
            flat dense color="primary" icon="add" label="Adicionar ingrediente"
            @click="openIngredientDialog(flavor)"
          />
        </div>
      </q-expansion-item>
    </q-list>
  </q-card>

  <!-- ── Dialog: Criar / Editar Opção ──────────────────────────── -->
  <q-dialog v-model="flavorDialog.open" persistent>
    <q-card style="min-width: 420px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ flavorDialog.editing ? 'Editar Opção' : 'Nova Opção' }}</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="flavorFormRef">
          <div class="q-gutter-md">
            <q-input
              v-model="flavorDialog.form.name"
              outlined
              label="Nome da opção *"
              placeholder="Ex: Calabresa, Frango com Catupiry, Base Morango"
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="tune" />
              </template>
            </q-input>

            <q-input
              v-model.number="flavorDialog.form.price"
              outlined
              type="number"
              step="0.01"
              min="0"
              label="Preço (R$)"
              hint="0,00 = incluído no produto"
              :rules="[
                (val) => val >= 0 || 'Preço deve ser >= 0',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>

            <q-input
              v-model.number="flavorDialog.form.max_qty"
              outlined
              type="number"
              step="1"
              min="0"
              label="Limite por pedido"
              hint="0 = sem limite; 3 = no máximo 3× esta opção"
              :rules="[(val) => val >= 0 || 'Deve ser >= 0']"
            >
              <template v-slot:prepend>
                <q-icon name="repeat" />
              </template>
            </q-input>

            <div class="status-section">
              <q-toggle
                v-model="flavorDialog.form.is_available"
                color="positive"
                size="md"
                checked-icon="check"
                unchecked-icon="close"
              >
                <span class="q-ml-sm text-body2">
                  {{ flavorDialog.form.is_available ? 'Disponível' : 'Indisponível' }}
                </span>
              </q-toggle>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          :label="flavorDialog.editing ? 'Salvar' : 'Criar Opção'"
          color="primary"
          :loading="flavorDialog.saving"
          @click="handleSaveFlavor"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- ── Dialog: Criar / Editar Ingrediente ────────────────────── -->
  <q-dialog v-model="ingredientDialog.open" persistent>
    <q-card style="min-width: 380px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ ingredientDialog.editing ? 'Editar Ingrediente' : 'Novo Ingrediente' }}</div>
        <div class="text-caption" style="opacity: 0.85">{{ ingredientDialog.flavorName }}</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="ingredientFormRef">
          <q-input
            v-model="ingredientDialog.form.name"
            outlined
            label="Nome do ingrediente *"
            placeholder="Ex: Muçarela, Calabresa defumada, Cebola"
            :rules="[(val) => !!val || 'Nome é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="egg_alt" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>

      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          :label="ingredientDialog.editing ? 'Salvar' : 'Adicionar'"
          color="primary"
          :loading="ingredientDialog.saving"
          @click="handleSaveIngredient"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useNotify from 'src/composables/showNotify'
import useConfirmDialog from 'src/composables/useConfirmDialog'
import { FlavorService } from 'src/services/FlavorService'

const props = defineProps({
  productUuid: {
    type: String,
    required: true,
  },
})

const { notifySuccess, notifyError } = useNotify()
const { confirm } = useConfirmDialog()

// ── State ─────────────────────────────────────────────────────

const flavors = ref([])
const loading = ref(false)

// ── Dialog: Sabor ──────────────────────────────────────────────

const flavorFormRef = ref(null)
const flavorDialog = ref({
  open: false,
  editing: false,
  saving: false,
  flavorUuid: null,
  form: { name: '', price: 0, is_available: true, max_qty: 0 },
})

// ── Dialog: Ingrediente ────────────────────────────────────────

const ingredientFormRef = ref(null)
const ingredientDialog = ref({
  open: false,
  editing: false,
  saving: false,
  flavorUuid: null,
  flavorName: '',
  ingredientUuid: null,
  form: { name: '' },
})

// ── Load ──────────────────────────────────────────────────────

const loadFlavors = async () => {
  loading.value = true
  try {
    const resp = await FlavorService.getFlavors(props.productUuid)
    flavors.value = resp?.data?.flavors || resp?.flavors || []
  } catch {
    notifyError('Erro ao carregar opções de montagem')
  } finally {
    loading.value = false
  }
}

onMounted(loadFlavors)

// ── Helpers ───────────────────────────────────────────────────

const formatPrice = (price) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

// ── Opções ────────────────────────────────────────────────────

const openFlavorDialog = (flavor = null) => {
  flavorDialog.value = {
    open: true,
    editing: !!flavor,
    saving: false,
    flavorUuid: flavor?.uuid || null,
    form: {
      name: flavor?.name || '',
      price: flavor?.price ?? 0,
      is_available: flavor?.is_available ?? true,
      max_qty: flavor?.max_qty ?? 0,
    },
  }
}

const handleSaveFlavor = async () => {
  const valid = await flavorFormRef.value?.validate()
  if (!valid) return

  flavorDialog.value.saving = true
  try {
    const payload = {
      name: flavorDialog.value.form.name,
      price: flavorDialog.value.form.price,
      is_available: flavorDialog.value.form.is_available,
      max_qty: flavorDialog.value.form.max_qty,
    }

    if (flavorDialog.value.editing) {
      await FlavorService.updateFlavor(props.productUuid, flavorDialog.value.flavorUuid, payload)
      notifySuccess('Opção atualizada com sucesso!')
    } else {
      await FlavorService.createFlavor(props.productUuid, payload)
      notifySuccess('Opção criada com sucesso!')
    }

    flavorDialog.value.open = false
    await loadFlavors()
  } catch {
    notifyError(flavorDialog.value.editing ? 'Erro ao atualizar opção' : 'Erro ao criar opção')
  } finally {
    flavorDialog.value.saving = false
  }
}

const handleDeleteFlavor = async (flavor) => {
  const ok = await confirm({
    title: 'Remover opção',
    message: `Deseja remover a opção <b>"${flavor.name}"</b> e todos os seus ingredientes?`,
    okLabel: 'Remover',
    okColor: 'negative',
  })
  if (!ok) return

  try {
    await FlavorService.deleteFlavor(props.productUuid, flavor.uuid)
    notifySuccess('Opção removida com sucesso!')
    await loadFlavors()
  } catch {
    notifyError('Erro ao remover opção')
  }
}

const handleToggleFlavor = async (flavor, newValue) => {
  try {
    await FlavorService.updateFlavor(props.productUuid, flavor.uuid, { is_available: newValue })
    flavor.is_available = newValue
  } catch {
    notifyError('Erro ao atualizar disponibilidade')
  }
}

// ── Ingredientes ──────────────────────────────────────────────

const openIngredientDialog = (flavor, ingredient = null) => {
  ingredientDialog.value = {
    open: true,
    editing: !!ingredient,
    saving: false,
    flavorUuid: flavor.uuid,
    flavorName: flavor.name,
    ingredientUuid: ingredient?.uuid || null,
    form: { name: ingredient?.name || '' },
  }
}

const handleSaveIngredient = async () => {
  const valid = await ingredientFormRef.value?.validate()
  if (!valid) return

  ingredientDialog.value.saving = true
  try {
    const payload = { name: ingredientDialog.value.form.name }

    if (ingredientDialog.value.editing) {
      await FlavorService.updateIngredient(
        props.productUuid,
        ingredientDialog.value.flavorUuid,
        ingredientDialog.value.ingredientUuid,
        payload,
      )
      notifySuccess('Ingrediente atualizado com sucesso!')
    } else {
      await FlavorService.createIngredient(
        props.productUuid,
        ingredientDialog.value.flavorUuid,
        payload,
      )
      notifySuccess('Ingrediente adicionado com sucesso!')
    }

    ingredientDialog.value.open = false
    await loadFlavors()
  } catch {
    notifyError(
      ingredientDialog.value.editing ? 'Erro ao atualizar ingrediente' : 'Erro ao criar ingrediente',
    )
  } finally {
    ingredientDialog.value.saving = false
  }
}

const handleDeleteIngredient = async (flavor, ingredient) => {
  const ok = await confirm({
    title: 'Remover ingrediente',
    message: `Deseja remover o ingrediente <b>"${ingredient.name}"</b>?`,
    okLabel: 'Remover',
    okColor: 'negative',
  })
  if (!ok) return

  try {
    await FlavorService.deleteIngredient(props.productUuid, flavor.uuid, ingredient.uuid)
    notifySuccess('Ingrediente removido com sucesso!')
    await loadFlavors()
  } catch {
    notifyError('Erro ao remover ingrediente')
  }
}
</script>

<style lang="scss" scoped>
.flavor-item {
  :deep(.q-expansion-item__header) {
    padding: 12px 16px;
  }
}

.status-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
  border-left: 3px solid #e0e0e0;

  .body--dark & {
    background: #2a2a2a;
    border-left-color: #444;
  }
}

.bordered {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
