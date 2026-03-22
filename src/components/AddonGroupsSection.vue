<template>
  <q-card class="q-mt-lg">
    <!-- Cabeçalho -->
    <q-card-section class="bg-grey-2 text-dark">
      <div class="row items-center justify-between">
        <div>
          <div class="text-h6 text-weight-bold">
            <q-icon name="add_shopping_cart" class="q-mr-sm" />
            Grupos de Adicionais
          </div>
          <div class="text-caption text-grey-7 q-mt-xs">
            Configure complementos e opções extras para este produto (ex: Molhos, Extras, Tamanhos)
          </div>
        </div>
        <q-btn
          unelevated
          color="primary"
          icon="add"
          label="Novo Grupo"
          @click="openGroupDialog()"
        />
      </div>
    </q-card-section>

    <q-separator />

    <!-- Loading -->
    <div v-if="loading" class="flex flex-center q-pa-xl">
      <q-spinner-ios color="primary" size="40px" />
    </div>

    <!-- Sem grupos -->
    <div v-else-if="groups.length === 0" class="flex flex-center column q-pa-xl text-grey-6">
      <q-icon name="playlist_add" size="56px" />
      <div class="q-mt-md text-body2">Nenhum grupo de adicionais cadastrado</div>
      <div class="text-caption">Clique em "Novo Grupo" para começar</div>
    </div>

    <!-- Lista de grupos -->
    <q-list v-else separator>
      <q-expansion-item
        v-for="group in groups"
        :key="group.uuid"
        expand-separator
        :default-opened="false"
        class="addon-group-item"
      >
        <!-- Cabeçalho do grupo -->
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="list_alt" color="primary" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">{{ group.name }}</q-item-label>
            <q-item-label caption>
              <span v-if="group.min_qty > 0" class="text-negative q-mr-sm">
                <q-icon name="star" size="10px" /> obrigatório
              </span>
              <span class="text-grey-7">
                Mín: {{ group.min_qty }} &nbsp;·&nbsp; Máx: {{ group.max_qty }} &nbsp;·&nbsp;
                {{ group.addons?.length || 0 }} adicional(is)
              </span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row q-gutter-xs" @click.stop>
              <q-btn
                flat
                round
                dense
                icon="edit"
                color="grey-7"
                @click="openGroupDialog(group)"
              >
                <q-tooltip>Editar grupo</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                icon="delete"
                color="negative"
                @click="handleDeleteGroup(group)"
              >
                <q-tooltip>Remover grupo</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </template>

        <!-- Conteúdo expandido: lista de adicionais -->
        <div class="q-px-md q-pb-md">
          <!-- Sem adicionais -->
          <div v-if="!group.addons || group.addons.length === 0" class="text-grey-6 text-caption q-py-sm">
            Nenhum adicional neste grupo
          </div>

          <!-- Adicionais -->
          <q-list v-else dense separator class="rounded-borders bordered q-mb-md">
            <q-item v-for="addon in group.addons" :key="addon.uuid" class="q-py-sm">
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ addon.name }}</q-item-label>
                <q-item-label caption class="text-primary">
                  {{ addon.price > 0 ? formatPrice(addon.price) : 'Incluído' }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center q-gutter-xs">
                  <q-toggle
                    :model-value="addon.is_available"
                    color="positive"
                    size="sm"
                    dense
                    @update:model-value="(val) => handleToggleAddon(group, addon, val)"
                  >
                    <q-tooltip>{{ addon.is_available ? 'Disponível' : 'Indisponível' }}</q-tooltip>
                  </q-toggle>
                  <q-btn flat round dense icon="edit" color="grey-7" @click="openAddonDialog(group, addon)">
                    <q-tooltip>Editar adicional</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense icon="delete" color="negative" @click="handleDeleteAddon(group, addon)">
                    <q-tooltip>Remover adicional</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Botão adicionar addon -->
          <q-btn
            flat
            dense
            color="primary"
            icon="add"
            label="Adicionar item"
            @click="openAddonDialog(group)"
          />
        </div>
      </q-expansion-item>
    </q-list>
  </q-card>

  <!-- ── Dialog: Criar / Editar Grupo ─────────────────────────── -->
  <q-dialog v-model="groupDialog.open" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ groupDialog.editing ? 'Editar Grupo' : 'Novo Grupo de Adicionais' }}</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="groupFormRef">
          <div class="q-gutter-md">
            <q-input
              v-model="groupDialog.form.name"
              outlined
              label="Nome do grupo *"
              placeholder="Ex: Molhos, Extras, Tamanho"
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="label" />
              </template>
            </q-input>

            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model.number="groupDialog.form.min_qty"
                  outlined
                  type="number"
                  label="Mínimo de seleções"
                  min="0"
                  hint="0 = opcional"
                  :rules="[(val) => val >= 0 || 'Mínimo >= 0']"
                />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="groupDialog.form.max_qty"
                  outlined
                  type="number"
                  label="Máximo de seleções"
                  min="1"
                  :rules="[
                    (val) => val >= 1 || 'Mínimo de 1',
                    (val) => val >= groupDialog.form.min_qty || 'Máximo deve ser >= mínimo',
                  ]"
                />
              </div>
            </div>

            <div class="text-caption text-grey-7 q-mt-xs">
              <q-icon name="info" size="14px" /> Mínimo > 0 torna o grupo obrigatório na hora do pedido
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />
      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        <q-btn
          unelevated
          :label="groupDialog.editing ? 'Salvar' : 'Criar Grupo'"
          color="primary"
          :loading="groupDialog.saving"
          @click="handleSaveGroup"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- ── Dialog: Criar / Editar Adicional ──────────────────────── -->
  <q-dialog v-model="addonDialog.open" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ addonDialog.editing ? 'Editar Adicional' : 'Novo Adicional' }}</div>
        <div class="text-caption" style="opacity: 0.85">{{ addonDialog.groupName }}</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form ref="addonFormRef">
          <div class="q-gutter-md">
            <q-input
              v-model="addonDialog.form.name"
              outlined
              label="Nome do adicional *"
              placeholder="Ex: Queijo extra, Molho barbecue"
              :rules="[(val) => !!val || 'Nome é obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="restaurant" />
              </template>
            </q-input>

            <q-input
              v-model.number="addonDialog.form.price"
              outlined
              type="number"
              step="0.01"
              min="0"
              label="Preço (R$)"
              hint="0,00 = incluído no produto"
              :rules="[(val) => val >= 0 || 'Preço deve ser >= 0']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_money" />
              </template>
            </q-input>

            <div class="status-section">
              <q-toggle
                v-model="addonDialog.form.is_available"
                color="positive"
                size="md"
                checked-icon="check"
                unchecked-icon="close"
              >
                <span class="q-ml-sm text-body2">
                  {{ addonDialog.form.is_available ? 'Disponível' : 'Indisponível' }}
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
          :label="addonDialog.editing ? 'Salvar' : 'Adicionar'"
          color="primary"
          :loading="addonDialog.saving"
          @click="handleSaveAddon"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useNotify from 'src/composables/showNotify'
import useConfirmDialog from 'src/composables/useConfirmDialog'
import { AddonGroupService } from 'src/services/AddonGroupService'

const props = defineProps({
  productUuid: {
    type: String,
    required: true,
  },
})

const { notifySuccess, notifyError } = useNotify()
const { confirm } = useConfirmDialog()

// ── State ─────────────────────────────────────────────────────

const groups = ref([])
const loading = ref(false)

// ── Dialog: Grupo ─────────────────────────────────────────────

const groupFormRef = ref(null)
const groupDialog = ref({
  open: false,
  editing: false,
  saving: false,
  groupUuid: null,
  form: { name: '', min_qty: 0, max_qty: 1 },
})

// ── Dialog: Adicional ─────────────────────────────────────────

const addonFormRef = ref(null)
const addonDialog = ref({
  open: false,
  editing: false,
  saving: false,
  groupUuid: null,
  groupName: '',
  addonUuid: null,
  form: { name: '', price: 0, is_available: true },
})

// ── Load ──────────────────────────────────────────────────────

const loadGroups = async () => {
  loading.value = true
  try {
    const resp = await AddonGroupService.getGroups(props.productUuid)
    groups.value = resp?.data?.addon_groups || resp?.addon_groups || []
  } catch {
    notifyError('Erro ao carregar grupos de adicionais')
  } finally {
    loading.value = false
  }
}

onMounted(loadGroups)

// ── Helpers ───────────────────────────────────────────────────

const formatPrice = (price) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

// ── Grupos ────────────────────────────────────────────────────

const openGroupDialog = (group = null) => {
  groupDialog.value = {
    open: true,
    editing: !!group,
    saving: false,
    groupUuid: group?.uuid || null,
    form: {
      name: group?.name || '',
      min_qty: group?.min_qty ?? 0,
      max_qty: group?.max_qty ?? 1,
    },
  }
}

const handleSaveGroup = async () => {
  const valid = await groupFormRef.value?.validate()
  if (!valid) return

  groupDialog.value.saving = true
  try {
    const payload = {
      name: groupDialog.value.form.name,
      min_qty: groupDialog.value.form.min_qty,
      max_qty: groupDialog.value.form.max_qty,
    }

    if (groupDialog.value.editing) {
      await AddonGroupService.updateGroup(props.productUuid, groupDialog.value.groupUuid, payload)
      notifySuccess('Grupo atualizado com sucesso!')
    } else {
      await AddonGroupService.createGroup(props.productUuid, payload)
      notifySuccess('Grupo criado com sucesso!')
    }

    groupDialog.value.open = false
    await loadGroups()
  } catch {
    notifyError(groupDialog.value.editing ? 'Erro ao atualizar grupo' : 'Erro ao criar grupo')
  } finally {
    groupDialog.value.saving = false
  }
}

const handleDeleteGroup = async (group) => {
  const ok = await confirm({
    title: 'Remover grupo',
    message: `Deseja remover o grupo <b>"${group.name}"</b> e todos os seus adicionais?`,
    okLabel: 'Remover',
    okColor: 'negative',
  })
  if (!ok) return

  try {
    await AddonGroupService.deleteGroup(props.productUuid, group.uuid)
    notifySuccess('Grupo removido com sucesso!')
    await loadGroups()
  } catch {
    notifyError('Erro ao remover grupo')
  }
}

// ── Adicionais ────────────────────────────────────────────────

const openAddonDialog = (group, addon = null) => {
  addonDialog.value = {
    open: true,
    editing: !!addon,
    saving: false,
    groupUuid: group.uuid,
    groupName: group.name,
    addonUuid: addon?.uuid || null,
    form: {
      name: addon?.name || '',
      price: addon?.price ?? 0,
      is_available: addon?.is_available ?? true,
    },
  }
}

const handleSaveAddon = async () => {
  const valid = await addonFormRef.value?.validate()
  if (!valid) return

  addonDialog.value.saving = true
  try {
    const payload = {
      name: addonDialog.value.form.name,
      price: addonDialog.value.form.price,
      is_available: addonDialog.value.form.is_available,
    }

    if (addonDialog.value.editing) {
      await AddonGroupService.updateAddon(
        props.productUuid,
        addonDialog.value.groupUuid,
        addonDialog.value.addonUuid,
        payload,
      )
      notifySuccess('Adicional atualizado com sucesso!')
    } else {
      await AddonGroupService.createAddon(
        props.productUuid,
        addonDialog.value.groupUuid,
        payload,
      )
      notifySuccess('Adicional adicionado com sucesso!')
    }

    addonDialog.value.open = false
    await loadGroups()
  } catch {
    notifyError(addonDialog.value.editing ? 'Erro ao atualizar adicional' : 'Erro ao criar adicional')
  } finally {
    addonDialog.value.saving = false
  }
}

const handleToggleAddon = async (group, addon, newValue) => {
  try {
    await AddonGroupService.updateAddon(props.productUuid, group.uuid, addon.uuid, {
      is_available: newValue,
    })
    addon.is_available = newValue
  } catch {
    notifyError('Erro ao atualizar disponibilidade')
  }
}

const handleDeleteAddon = async (group, addon) => {
  const ok = await confirm({
    title: 'Remover adicional',
    message: `Deseja remover o adicional <b>"${addon.name}"</b>?`,
    okLabel: 'Remover',
    okColor: 'negative',
  })
  if (!ok) return

  try {
    await AddonGroupService.deleteAddon(props.productUuid, group.uuid, addon.uuid)
    notifySuccess('Adicional removido com sucesso!')
    await loadGroups()
  } catch {
    notifyError('Erro ao remover adicional')
  }
}
</script>

<style lang="scss" scoped>
.addon-group-item {
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
