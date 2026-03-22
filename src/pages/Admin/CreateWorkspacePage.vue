<template>
  <q-page padding>
    <div class="rs-page-header">
      <div class="row items-center q-gutter-sm">
        <q-btn flat round dense icon="arrow_back" :to="{ name: 'admin-workspaces' }" />
        <div>
          <div class="rs-page-title">Novo Estabelecimento</div>
          <div class="rs-page-subtitle">Cadastre um novo estabelecimento (já ativado)</div>
        </div>
      </div>
    </div>

    <q-form @submit="handleSubmit">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">Dados do Responsável</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.owner_name"
                outlined
                dense
                label="Nome do responsável *"
                :rules="[(v) => !!v || 'Nome do responsável é obrigatório']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.wks_email"
                outlined
                dense
                label="E-mail de acesso *"
                type="email"
                hint="Será usado para fazer login no painel"
                :rules="[
                  (v) => !!v || 'E-mail é obrigatório',
                  (v) => /.+@.+\..+/.test(v) || 'E-mail inválido',
                ]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">Dados Gerais</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.wks_name"
                outlined
                dense
                label="Nome do estabelecimento *"
                :rules="[(v) => !!v || 'Nome é obrigatório']"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.wks_phone"
                outlined
                dense
                label="Telefone"
                mask="(##) #####-####"
                unmasked-value
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.wks_document_number"
                outlined
                dense
                label="CNPJ"
                mask="##.###.###/####-##"
                unmasked-value
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.wks_type_of_service"
                outlined
                dense
                label="Tipo de serviço"
                placeholder="Ex: Restaurante, Pizzaria..."
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.wks_domain_url"
                outlined
                dense
                label="Slug / Domínio"
                placeholder="Ex: meu-restaurante"
              />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.wks_description"
                outlined
                dense
                label="Descrição"
                type="textarea"
                rows="2"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-medium q-mb-md">Endereço</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-input
                v-model="form.wks_address_zipcode"
                outlined
                dense
                label="CEP"
                mask="#####-###"
                unmasked-value
              />
            </div>
            <div class="col-12 col-sm-8">
              <q-input v-model="form.wks_address" outlined dense label="Endereço" />
            </div>
            <div class="col-12 col-sm-3">
              <q-input v-model="form.wks_address_number" outlined dense label="Número" />
            </div>
            <div class="col-12 col-sm-5">
              <q-input v-model="form.wks_address_neighborhood" outlined dense label="Bairro" />
            </div>
            <div class="col-12 col-sm-4">
              <q-input v-model="form.wks_address_complement" outlined dense label="Complemento" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="form.wks_address_city" outlined dense label="Cidade" />
            </div>
            <div class="col-12 col-sm-6">
              <q-input v-model="form.wks_address_state" outlined dense label="Estado" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row justify-end q-gutter-sm">
        <q-btn flat no-caps label="Cancelar" :to="{ name: 'admin-workspaces' }" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Criar Estabelecimento"
          type="submit"
          :loading="saving"
          style="border-radius: 8px"
        />
      </div>
    </q-form>

    <!-- Dialog com senha temporária -->
    <q-dialog v-model="showTempPassword" persistent>
      <q-card style="min-width: 340px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Estabelecimento criado!</div>
        </q-card-section>

        <q-card-section>
          <p class="text-body2 q-mb-md">
            Passe as credenciais abaixo para o responsável. A senha temporária
            <strong>só aparece uma vez</strong>.
          </p>

          <q-input
            :model-value="createdEmail"
            outlined
            dense
            readonly
            label="E-mail de acesso"
            class="q-mb-sm"
          >
            <template #append>
              <q-btn flat round dense icon="content_copy" @click="copy(createdEmail)" />
            </template>
          </q-input>

          <q-input :model-value="tempPassword" outlined dense readonly label="Senha temporária">
            <template #append>
              <q-btn flat round dense icon="content_copy" @click="copy(tempPassword)" />
            </template>
          </q-input>

          <q-banner class="bg-warning text-dark q-mt-md rounded-borders text-caption">
            No primeiro acesso, o responsável será solicitado a definir uma nova senha.
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Entendi"
            @click="goToWorkspace"
            style="border-radius: 8px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { AdminService } from 'src/services/AdminService'
import useNotify from 'src/composables/showNotify'

const router = useRouter()
const $q = useQuasar()
const { notifyError } = useNotify()
const saving = ref(false)

const showTempPassword = ref(false)
const tempPassword = ref('')
const createdEmail = ref('')
const createdWorkspaceUuid = ref(null)

const form = ref({
  owner_name: '',
  wks_name: '',
  wks_email: '',
  wks_phone: '',
  wks_document_number: '',
  wks_type_of_service: '',
  wks_domain_url: '',
  wks_description: '',
  wks_address_zipcode: '',
  wks_address: '',
  wks_address_number: '',
  wks_address_neighborhood: '',
  wks_address_complement: '',
  wks_address_city: '',
  wks_address_state: '',
})

async function handleSubmit() {
  saving.value = true
  try {
    const payload = Object.fromEntries(
      Object.entries(form.value).filter(([, v]) => v !== '' && v !== null),
    )
    const resp = await AdminService.createWorkspace(payload)
    const data = resp?.data
    tempPassword.value = data?.temp_password ?? ''
    createdEmail.value = form.value.wks_email
    createdWorkspaceUuid.value = data?.workspace?.wks_uuid ?? null
    showTempPassword.value = true
  } catch (err) {
    notifyError(err?.response?.data?.message || err?.message || 'Erro ao criar estabelecimento')
  } finally {
    saving.value = false
  }
}

function copy(text) {
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({ type: 'positive', message: 'Copiado!', timeout: 1500 })
  })
}

function goToWorkspace() {
  showTempPassword.value = false
  if (createdWorkspaceUuid.value) {
    router.push({ name: 'admin-workspace-detail', params: { uuid: createdWorkspaceUuid.value } })
  } else {
    router.push({ name: 'admin-workspaces' })
  }
}
</script>
