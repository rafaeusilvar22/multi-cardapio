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

          <q-form ref="loginFormRef" class="rs-login-form" @submit="handleLogin">
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
              <router-link :to="{ name: 'forgot-password' }" class="rs-login-forgot-link q-mt-xs">
                Esqueci minha senha
              </router-link>
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

  <!-- Modal: primeiro acesso — definir nova senha -->
  <q-dialog v-model="showChangePassword" persistent>
    <q-card style="min-width: 360px">
      <q-card-section>
        <div class="text-h6 q-mb-xs">Defina sua nova senha</div>
        <div class="text-caption text-grey-7">
          Este é seu primeiro acesso. Crie uma senha pessoal para continuar.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form ref="changePasswordFormRef" @submit="handleChangePassword">
          <q-input
            v-model="newPassword"
            outlined
            dense
            :type="showNewPassword ? 'text' : 'password'"
            label="Nova senha *"
            class="q-mb-sm"
            :rules="[(v) => (v && v.length >= 6) || 'Mínimo 6 caracteres']"
          >
            <template #append>
              <q-icon
                :name="showNewPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showNewPassword = !showNewPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            outlined
            dense
            :type="showConfirmPassword ? 'text' : 'password'"
            label="Confirmar senha *"
            :rules="[(v) => v === newPassword || 'As senhas não coincidem']"
          >
            <template #append>
              <q-icon
                :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>

          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Salvar senha"
            type="submit"
            class="full-width q-mt-md"
            :loading="changingPassword"
            style="border-radius: 8px"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth'
import { AuthService } from 'src/services/AuthService'
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

// Primeiro acesso
const showChangePassword = ref(false)
const changingPassword = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const changePasswordFormRef = ref(null)

const handleLogin = async () => {
  loading.value = true
  try {
    const response = await authStore.login(formData.value)
    if (authStore.user?.status === 'first-access') {
      showChangePassword.value = true
    } else {
      notifySuccess(t(response.message), 'bottom-right')
      router.push({ name: 'dashboard' })
    }
  } catch (error) {
    notifyError(t(error.message), 'bottom-right')
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  changingPassword.value = true
  try {
    await AuthService.changePassword({
      new_password: newPassword.value,
      confirm_password: confirmPassword.value,
    })
    authStore.authUser = { ...authStore.authUser, status: 'active' }
    showChangePassword.value = false
    notifySuccess('Senha definida com sucesso!', 'bottom-right')
    router.push({ name: 'dashboard' })
  } catch (error) {
    notifyError(error?.response?.data?.message || error?.message || 'Erro ao salvar senha', 'bottom-right')
  } finally {
    changingPassword.value = false
  }
}
</script>

<style scoped lang="scss">
@import 'src/assets/pages/auth/login.scss';
</style>
