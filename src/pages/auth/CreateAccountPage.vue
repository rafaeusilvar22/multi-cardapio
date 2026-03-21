<template>
  <q-page class="rs-signup-page">
    <div class="row no-wrap full-height">
      <!-- Left Side: Image (Desktop only) -->
      <div class="col-6 gt-sm rs-image-section">
        <div class="rs-image-overlay">
          <div class="rs-overlay-content">
            <q-icon name="restaurant_menu" size="80px" color="white" class="q-mb-md" />
            <div class="text-h4 text-white text-weight-bold q-mb-sm">Gerencie seu Restaurante</div>
            <div class="text-subtitle1 text-white">
              Cadastre-se agora e tenha acesso a todas as ferramentas para gerenciar seu negócio
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="col-12 col-sm-6 rs-form-section">
        <div class="rs-form-container">
          <div class="rs-form-header">
            <div class="text-h5 text-weight-bold text-primary">
              {{ currentStep === 1 ? 'Crie sua Conta' : 'Cadastre seu Restaurante' }}
            </div>
            <div class="text-subtitle2 text-grey-7 q-mt-sm">
              {{
                currentStep === 1 ? 'Preencha seus dados pessoais' : 'Dados do seu estabelecimento'
              }}
            </div>

            <div class="rs-stepper q-mt-lg">
              <div
                class="rs-step"
                :class="{ active: currentStep === 1, completed: currentStep > 1 }"
              >
                <div class="rs-step-number">1</div>
                <div class="rs-step-label">Dados Pessoais</div>
              </div>
              <div class="rs-step-line" :class="{ active: currentStep > 1 }"></div>
              <div class="rs-step" :class="{ active: currentStep === 2 }">
                <div class="rs-step-number">2</div>
                <div class="rs-step-label">Estabelecimento</div>
              </div>
            </div>
          </div>

          <q-form @submit="currentStep === 1 ? handleNext() : onSubmit()" class="rs-form">
            <div v-if="currentStep === 1" class="rs-step-content">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.first_name"
                    label="Nome *"
                    borderless
                    no-error-icon
                    class="rs-input-base"
                    :rules="[(val) => !!val || 'Campo obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.last_name"
                    label="Sobrenome *"
                    borderless
                    no-error-icon
                    class="rs-input-base"
                    :rules="[(val) => !!val || 'Campo obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="badge" />
                    </template>
                  </q-input>
                </div>
              </div>

              <q-input
                borderless
                type="email"
                no-error-icon
                label="E-mail *"
                class="rs-input-base"
                v-model="form.email"
                :rules="[
                  (val) => !!val || 'Campo obrigatório',
                  (val) => isValidEmail(val) || 'E-mail inválido',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                borderless
                no-error-icon
                unmasked-value
                label="Telefone *"
                v-model="form.phone"
                class="rs-input-base"
                mask="(##) #####-####"
                :rules="[
                  (val) => !!val || 'Campo obrigatório',
                  (val) => val.length === 11 || 'Telefone inválido',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>

              <q-input
                borderless
                label="Senha *"
                no-error-icon
                class="rs-input-base"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :rules="[
                  (val) => !!val || 'Campo obrigatório',
                  (val) => val.length >= 8 || 'Mínimo 8 caracteres',
                  (val) => /[A-Z]/.test(val) || 'Deve conter letra maiúscula',
                  (val) => /[a-z]/.test(val) || 'Deve conter letra minúscula',
                  (val) => /[0-9]/.test(val) || 'Deve conter número',
                  (val) => /[!@#$%^&*]/.test(val) || 'Deve conter caractere especial (!@#$%^&*)',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-input
                borderless
                no-error-icon
                class="rs-input-base"
                label="Confirmação de Senha *"
                v-model="form.confirm_password"
                :type="showPasswordConfirmation ? 'text' : 'password'"
                :rules="[
                  (val) => !!val || 'Campo obrigatório',
                  (val) => val === form.password || 'As senhas não coincidem',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPasswordConfirmation ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPasswordConfirmation = !showPasswordConfirmation"
                  />
                </template>
              </q-input>
            </div>

            <div v-else class="rs-step-content">
              <q-input
                borderless
                no-error-icon
                v-model="form.group_name"
                label="Nome do Estabelecimento *"
                class="rs-input-base"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="restaurant" />
                </template>
              </q-input>

              <q-input
                borderless
                label="CEP *"
                no-error-icon
                unmasked-value
                mask="#####-###"
                class="rs-input-base"
                v-model="form.zip_code"
                :loading="loadingZipCode"
                :rules="[
                  (val) => !!val || 'Campo obrigatório',
                  (val) => val.length === 8 || 'CEP inválido',
                ]"
                @update:model-value="fetchZipCode"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>

              <q-input
                borderless
                no-error-icon
                label="Endereço *"
                v-model="form.address"
                class="rs-input-base"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="home" />
                </template>
              </q-input>

              <q-input
                borderless
                no-error-icon
                label="Bairro *"
                v-model="form.neighborhood"
                class="rs-input-base"
                :rules="[(val) => !!val || 'Campo obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="signpost" />
                </template>
              </q-input>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-4">
                  <q-input
                    borderless
                    no-error-icon
                    label="Número *"
                    v-model="form.number"
                    class="rs-input-base"
                    :rules="[(val) => !!val || 'Campo obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="tag" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-8">
                  <q-input
                    borderless
                    no-error-icon
                    label="Complemento"
                    class="rs-input-base"
                    v-model="form.complement"
                  >
                    <template v-slot:prepend>
                      <q-icon name="add_home" />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-8">
                  <q-input
                    borderless
                    no-error-icon
                    label="Cidade *"
                    v-model="form.city"
                    class="rs-input-base"
                    :rules="[(val) => !!val || 'Campo obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="location_city" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-sm-4">
                  <q-input
                    borderless
                    label="Estado *"
                    no-error-icon
                    v-model="form.state"
                    class="rs-input-base"
                    maxlength="2"
                    :rules="[(val) => !!val || 'Campo obrigatório']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="map" />
                    </template>
                  </q-input>
                </div>
              </div>
            </div>

            <div class="rs-form-actions">
              <q-btn
                flat
                label="Voltar"
                color="primary"
                class="rs-btn-back"
                v-if="currentStep === 2"
                @click="currentStep = 1"
              />
              <q-btn
                unelevated
                type="submit"
                color="primary"
                :loading="loading"
                class="rs-btn-submit"
                :icon-right="currentStep === 1 ? 'arrow_forward' : 'check'"
                :label="currentStep === 1 ? 'Próximo' : 'Criar Conta e Continuar'"
              />
            </div>

            <div class="text-center q-mt-md text-caption text-grey-7">
              Ao criar sua conta, você concorda com nossos
              <span class="text-primary cursor-pointer">Termos de Uso</span> e
              <span class="text-primary cursor-pointer">Política de Privacidade</span>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useNotify from 'src/composables/showNotify'
import { useAuthStore } from 'src/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { notifyError, notifySuccess } = useNotify()

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  group_name: '',
  neighborhood: '',
  zip_code: '',
  address: '',
  number: '',
  complement: '',
  city: '',
  state: '',
})

const currentStep = ref(1)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const loading = ref(false)
const loadingZipCode = ref(false)

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const handleNext = () => {
  currentStep.value = 2
}

const fetchZipCode = async (zipCode) => {
  if (zipCode && zipCode.length === 8) {
    loadingZipCode.value = true
    try {
      const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
      const data = await response.json()

      if (!data.erro) {
        form.value.address = data.logradouro
        form.value.neighborhood = data.bairro
        form.value.city = data.localidade
        form.value.state = data.uf
        notifySuccess('CEP encontrado!')
      } else {
        notifyError('CEP inválido')
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      notifyError('Erro ao buscar CEP')
    } finally {
      loadingZipCode.value = false
    }
  }
}

const onSubmit = async () => {
  loading.value = true
  try {
    const response = await authStore.createNewUser(form.value)
    notifySuccess(t(response.message || 'Conta criada com sucesso!'), 'bottom-right')
    router.push({ name: 'login' })
  } catch (error) {
    const errorMessage = error.message || 'Erro ao criar conta'
    notifyError(t(errorMessage), 'bottom-right')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@import 'src/assets/utilities/animations.scss';
@import 'src/assets/pages/auth/create-account.scss';
</style>
