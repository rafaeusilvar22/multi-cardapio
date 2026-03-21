<template>
  <q-page class="rs-login-page">
    <div class="row no-wrap full-height">
      <!-- Left Side: Image (Desktop only) -->
      <div class="col-6 gt-sm rs-login-image-section">
        <div class="rs-login-overlay">
          <div class="rs-login-overlay-content">
            <q-icon name="lock_reset" size="80px" color="white" class="q-mb-md" />
            <div class="text-h4 text-white text-weight-bold q-mb-sm">Nova senha</div>
            <div class="text-subtitle1 text-white">
              Escolha uma senha forte para proteger sua conta
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side -->
      <div class="col-12 col-sm-6 rs-login-form-section">
        <div class="rs-login-form-container">

          <!-- Invalid link -->
          <div v-if="!token || !email" class="text-center q-py-lg">
            <q-icon name="link_off" size="64px" color="negative" class="q-mb-md" />
            <div class="text-h6 text-weight-medium q-mb-sm">Link inválido</div>
            <div class="text-body2 text-grey-7 q-mb-lg">
              Este link de redefinição é inválido ou está incompleto. Solicite um novo.
            </div>
            <q-btn unelevated no-caps label="Solicitar novo link" color="primary" :to="{ name: 'forgot-password' }" />
          </div>

          <!-- Success state -->
          <div v-else-if="success" class="text-center q-py-lg">
            <q-icon name="check_circle" size="64px" color="positive" class="q-mb-md" />
            <div class="text-h6 text-weight-medium q-mb-sm">Senha redefinida!</div>
            <div class="text-body2 text-grey-7 q-mb-lg">
              Sua senha foi atualizada com sucesso. Você já pode fazer login.
            </div>
            <q-btn unelevated no-caps label="Ir para o login" color="primary" :to="{ name: 'login' }" icon-right="login" />
          </div>

          <!-- Form state -->
          <template v-else>
            <div class="rs-login-form-header">
              <div class="text-h5 text-weight-bold text-primary">Redefinir senha</div>
              <div class="text-subtitle2 text-grey-7 q-mt-sm">
                Crie uma nova senha para a conta <strong>{{ email }}</strong>
              </div>
            </div>

            <q-form class="rs-login-form" @submit="handleSubmit">
              <q-input
                v-model="form.password"
                borderless
                class="rs-input-base"
                dense
                label="Nova senha"
                :type="showPassword ? 'text' : 'password'"
                :rules="[
                  (val) => !!val || 'Senha obrigatória',
                  (val) => val.length >= 8 || 'Mínimo de 8 caracteres',
                ]"
              >
                <template v-slot:prepend><q-icon name="lock" /></template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <q-input
                v-model="form.confirmPassword"
                borderless
                class="rs-input-base"
                dense
                label="Confirmar nova senha"
                :type="showConfirm ? 'text' : 'password'"
                :rules="[
                  (val) => !!val || 'Confirmação obrigatória',
                  (val) => val === form.password || 'As senhas não conferem',
                ]"
              >
                <template v-slot:prepend><q-icon name="lock_outline" /></template>
                <template v-slot:append>
                  <q-icon
                    :name="showConfirm ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirm = !showConfirm"
                  />
                </template>
              </q-input>

              <q-btn
                no-caps
                unelevated
                label="Redefinir senha"
                color="primary"
                class="full-width rs-login-btn-submit"
                icon-right="check"
                type="submit"
                :loading="loading"
                :disabled="loading"
              />
            </q-form>
          </template>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { AuthService } from 'src/services/AuthService'
import useNotify from 'src/composables/showNotify'

defineOptions({ name: 'ResetPasswordPage' })

const route = useRoute()
const { notifyError } = useNotify()

const token = route.query.token || ''
const email = route.query.email || ''

const loading = ref(false)
const success = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)

const form = ref({
  password: '',
  confirmPassword: '',
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await AuthService.resetPassword({
      email,
      token,
      password: form.value.password,
      confirm_password: form.value.confirmPassword,
    })
    success.value = true
  } catch (err) {
    notifyError(err?.message || 'Link inválido ou expirado. Solicite um novo.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@import 'src/assets/pages/auth/login.scss';
</style>
