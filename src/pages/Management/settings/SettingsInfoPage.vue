<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <div class="rs-page-header q-mb-lg">
          <div>
            <div class="text-caption text-grey-5 q-mb-xs">Configurações</div>
            <div class="rs-page-title">Informações</div>
            <div class="rs-page-subtitle">Dados básicos do seu estabelecimento</div>
          </div>
        </div>

        <q-card flat bordered class="settings-card">
          <q-form ref="infoFormRef" @submit="handleSaveInfo" class="q-pa-lg">

            <!-- Imagens -->
            <div class="section-block q-mb-xl">
              <div class="section-title q-mb-lg">
                <q-icon name="image" size="20px" class="q-mr-sm" />Imagens
              </div>

              <div class="row q-col-gutter-lg">
                <div class="col-12 col-sm-4">
                  <div class="upload-label q-mb-sm">Logo do Estabelecimento</div>
                  <ImageUploadZone
                    :preview="infoForm.logo"
                    label="Clique ou arraste o logo"
                    hint="400 × 400 px recomendado"
                    :aspect-ratio="1"
                    @change="(file, url) => { logoFile = file; infoForm.logo = url }"
                    @remove="() => { logoFile = null; infoForm.logo = null }"
                    @error="notifyError"
                  />
                </div>

                <div class="col-12 col-sm-8">
                  <div class="upload-label q-mb-sm">Banner do Estabelecimento</div>
                  <ImageUploadZone
                    :preview="infoForm.banner"
                    label="Clique ou arraste o banner"
                    hint="1200 × 400 px recomendado"
                    :aspect-ratio="3"
                    @change="(file, url) => { bannerFile = file; infoForm.banner = url }"
                    @remove="() => { bannerFile = null; infoForm.banner = null }"
                    @error="notifyError"
                  />
                </div>
              </div>
            </div>

            <!-- Informações Básicas -->
            <div class="section-block q-mb-xl">
              <div class="section-title q-mb-lg">
                <q-icon name="store" size="20px" class="q-mr-sm" />Informações Básicas
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input
                    v-model="infoForm.name"
                    outlined
                    label="Nome do Estabelecimento *"
                    placeholder="Ex: Restaurante do João"
                    :rules="[(val) => !!val || 'Nome é obrigatório']"
                  >
                    <template v-slot:prepend><q-icon name="business" /></template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="infoForm.phone"
                    outlined
                    label="Telefone *"
                    placeholder="(47) 99999-9999"
                    mask="(##) #####-####"
                    :rules="[(val) => !!val || 'Telefone é obrigatório']"
                  >
                    <template v-slot:prepend><q-icon name="phone" /></template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="infoForm.email"
                    outlined
                    type="email"
                    label="E-mail"
                    placeholder="contato@restaurante.com"
                  >
                    <template v-slot:prepend><q-icon name="email" /></template>
                  </q-input>
                </div>

                <div class="col-12">
                  <q-input
                    v-model="infoForm.about"
                    outlined
                    type="textarea"
                    label="Sobre o estabelecimento"
                    placeholder="Conte um pouco sobre a história, especialidades e diferenciais do seu estabelecimento..."
                    autogrow
                  >
                    <template v-slot:prepend><q-icon name="info" /></template>
                  </q-input>
                </div>
              </div>
            </div>

            <!-- Endereço -->
            <div class="section-block q-mb-lg">
              <div class="section-title q-mb-lg">
                <q-icon name="place" size="20px" class="q-mr-sm" />Endereço
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <q-input
                    v-model="infoForm.address.cep"
                    outlined
                    label="CEP *"
                    placeholder="00000-000"
                    mask="#####-###"
                    :rules="[(val) => !!val || 'CEP é obrigatório']"
                  >
                    <template v-slot:prepend><q-icon name="pin_drop" /></template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-8">
                  <q-input
                    v-model="infoForm.address.street"
                    outlined
                    label="Rua/Avenida *"
                    placeholder="Rua das Flores"
                    :rules="[(val) => !!val || 'Rua é obrigatória']"
                  >
                    <template v-slot:prepend><q-icon name="location_on" /></template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-3">
                  <q-input
                    v-model="infoForm.address.number"
                    outlined
                    label="Número *"
                    placeholder="123"
                    :rules="[(val) => !!val || 'Número é obrigatório']"
                  />
                </div>

                <div class="col-12 col-sm-5">
                  <q-input
                    v-model="infoForm.address.complement"
                    outlined
                    label="Complemento"
                    placeholder="Sala 10"
                  />
                </div>

                <div class="col-12 col-sm-4">
                  <q-input
                    v-model="infoForm.address.neighborhood"
                    outlined
                    label="Bairro *"
                    placeholder="Centro"
                    :rules="[(val) => !!val || 'Bairro é obrigatório']"
                  />
                </div>

                <div class="col-12 col-sm-8">
                  <q-input
                    v-model="infoForm.address.city"
                    outlined
                    label="Cidade *"
                    placeholder="Indaial"
                    :rules="[(val) => !!val || 'Cidade é obrigatória']"
                  >
                    <template v-slot:prepend><q-icon name="location_city" /></template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-4">
                  <q-input
                    v-model="infoForm.address.state"
                    outlined
                    label="Estado *"
                    placeholder="SC"
                    maxlength="2"
                    :rules="[(val) => !!val || 'Estado é obrigatório']"
                  />
                </div>
              </div>
            </div>

            <div class="row justify-end">
              <q-btn
                unelevated
                label="Salvar Informações"
                color="primary"
                icon="save"
                padding="10px 32px"
                type="submit"
              />
            </div>

          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { EstablishmentService } from 'src/services/EstablishmentService'
import { useAuthStore } from 'src/stores/auth'
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'
import ImageUploadZone from 'src/components/ImageUploadZone.vue'

defineOptions({ name: 'SettingsInfoPage' })

const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()
const authStore = useAuthStore()

const infoFormRef = ref(null)
const logoFile = ref(null)
const bannerFile = ref(null)

const infoForm = ref({
  logo: null,
  banner: null,
  name: '',
  description: '',
  about: '',
  phone: '',
  email: '',
  type_of_service: '',
  document_type: '',
  document_number: '',
  domain_url: '',
  address: {
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  },
})

const applyGroupToForm = (group) => {
  if (!group) return
  infoForm.value.name = group.name || ''
  infoForm.value.description = group.description || ''
  infoForm.value.about = group.about || ''
  infoForm.value.phone = group.phone || ''
  infoForm.value.email = group.email || ''
  infoForm.value.logo = group.logo || null
  infoForm.value.banner = group.banner || null
  infoForm.value.type_of_service = group.type_of_service || ''
  infoForm.value.document_type = group.document_type || ''
  infoForm.value.document_number = group.document_number || ''
  infoForm.value.domain_url = group.domain_url || ''
  infoForm.value.address.street = group.address || ''
  infoForm.value.address.number = group.address_number || ''
  infoForm.value.address.complement = group.address_complement || ''
  infoForm.value.address.neighborhood = group.address_neighborhood || ''
  infoForm.value.address.city = group.address_city || ''
  infoForm.value.address.state = group.address_state || ''
  infoForm.value.address.cep = group.address_zipcode || ''
}

const syncStore = async () => {
  try {
    const resp = await EstablishmentService.getGroup(authStore.groupUuid)
    const data = resp?.data || resp
    const workspace = data?.workspace || data?.group || data
    if (workspace) authStore.authGroup = workspace
    if (data?.customizations) authStore.authCustomizations = data.customizations
  } catch {
    // best-effort
  }
}

const handleSaveInfo = async () => {
  const isValid = await infoFormRef.value.validate()
  if (!isValid) return

  const groupUuid = authStore.groupUuid
  if (!groupUuid) {
    notifyError('Grupo não identificado.')
    return
  }

  showLoading()
  try {
    if (logoFile.value) {
      await EstablishmentService.uploadLogo(groupUuid, logoFile.value)
      logoFile.value = null
    }

    if (bannerFile.value) {
      await EstablishmentService.uploadBanner(groupUuid, bannerFile.value)
      bannerFile.value = null
    }

    await EstablishmentService.updateSettings(groupUuid, {
      group: {
        name: infoForm.value.name,
        description: infoForm.value.description,
        about: infoForm.value.about,
        phone: infoForm.value.phone,
        email: infoForm.value.email,
        type_of_service: infoForm.value.type_of_service,
        document_type: infoForm.value.document_type,
        document_number: infoForm.value.document_number,
        domain_url: infoForm.value.domain_url,
        address: infoForm.value.address.street,
        address_number: infoForm.value.address.number,
        address_complement: infoForm.value.address.complement,
        address_neighborhood: infoForm.value.address.neighborhood,
        address_city: infoForm.value.address.city,
        address_state: infoForm.value.address.state,
        address_zipcode: infoForm.value.address.cep,
      },
    })
    await syncStore()
    notifySuccess('Informações salvas com sucesso!')
  } catch {
    notifyError('Erro ao salvar informações')
  } finally {
    hideLoading()
  }
}

onMounted(async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) return

  if (authStore.group) applyGroupToForm(authStore.group)

  showLoading()
  try {
    const resp = await EstablishmentService.getGroup(groupUuid)
    const data = resp?.data || resp
    const workspace = data?.workspace || data?.group || data
    applyGroupToForm(workspace)
  } catch {
    notifyError('Erro ao carregar informações do estabelecimento')
  } finally {
    hideLoading()
  }
})
</script>

<style lang="scss" scoped>
.settings-card {
  border-radius: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--q-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  .body--dark & {
    border-color: rgba(255, 255, 255, 0.08);
    color: var(--q-primary);
  }
}

.section-block {
  position: relative;
}

.upload-label {
  font-size: 12px;
  font-weight: 600;
  color: #90a4ae;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
