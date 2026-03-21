<template>
  <q-page class="rs-login-page">
    <div class="row no-wrap full-height">
      <!-- Left Side: Image (Desktop only) -->
      <div class="col-6 gt-sm rs-login-image-section">
        <div class="rs-login-overlay">
          <div class="rs-login-overlay-content">
            <q-icon name="restaurant_menu" size="80px" color="white" class="q-mb-md" />
            <div class="text-h4 text-white text-weight-bold q-mb-sm">Bem-vindo de volta</div>
            <div class="text-subtitle1 text-white">
              Acesse o painel e gerencie seus pedidos, cardápio e muito mais
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="col-12 col-sm-6 rs-login-form-section">
        <div class="rs-login-form-container">
          <div class="rs-login-form-header">
            <div class="text-h5 text-weight-bold text-primary">Entrar</div>
            <div class="text-subtitle2 text-grey-7 q-mt-sm">
              Acesse o painel de controle do seu estabelecimento
            </div>
          </div>

          <q-form class="rs-login-form" @submit="handleLogin">
            <q-input
              v-model="formData.email"
              borderless
              class="rs-input-base"
              dense
              type="email"
              label="E-mail"
              :rules="[(val) => (val && val.length > 0) || 'E-mail necessário']"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <div>
              <q-input
                v-model="formData.password"
                borderless
                class="rs-input-base"
                dense
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                :rules="[(val) => (val && val.length > 0) || 'Senha necessária']"
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
              <div class="rs-login-forgot-link q-mt-xs">Esqueci minha senha</div>
            </div>

            <q-btn
              no-caps
              unelevated
              label="Entrar"
              color="primary"
              class="full-width rs-login-btn-submit"
              icon-right="login"
              type="submit"
              :loading="loading"
              :disabled="loading"
            />

            <q-btn
              no-caps
              outline
              color="primary"
              label="Criar uma Conta"
              class="full-width"
              to="/criar-conta"
              icon-right="person_add"
            />
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import useNotify from 'src/composables/showNotify'

defineOptions({
  name: 'LoginPage',
})

const { t } = useI18n()
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const { notifyError, notifySuccess } = useNotify()

const formData = ref({
  email: '',
  password: '',
})

const handleLogin = async () => {
  try {
    const response = await authStore.login(formData.value)
    notifySuccess(t(response.message), 'bottom-right')
    router.push({ name: 'dashboard' })
  } catch (error) {
    notifyError(t(error.message), 'bottom-right')
  }
}
</script>

<style scoped lang="scss">
@import 'src/assets/pages/auth/login.scss';
</style>
