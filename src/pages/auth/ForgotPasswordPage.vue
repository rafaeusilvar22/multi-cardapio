<template>
  <q-page class="rs-login-page">
    <div class="row no-wrap full-height">
      <!-- Left Side: Image (Desktop only) -->
      <div class="col-6 gt-sm rs-login-image-section">
        <div class="rs-login-overlay">
          <div class="rs-login-overlay-content">
            <q-icon name="lock_reset" size="80px" color="white" class="q-mb-md" />
            <div class="text-h4 text-white text-weight-bold q-mb-sm">Recuperar acesso</div>
            <div class="text-subtitle1 text-white">
              Enviaremos um link para você redefinir a senha com segurança
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="col-12 col-sm-6 rs-login-form-section">
        <div class="rs-login-form-container">
          <div class="rs-login-form-header">
            <div class="text-h5 text-weight-bold text-primary">Esqueci minha senha</div>
            <div class="text-subtitle2 text-grey-7 q-mt-sm">
              Informe seu e-mail e enviaremos um link para redefinir sua senha
            </div>
          </div>

          <!-- Success state -->
          <div v-if="sent" class="text-center q-py-lg">
            <q-icon name="mark_email_read" size="64px" color="positive" class="q-mb-md" />
            <div class="text-h6 text-weight-medium q-mb-sm">E-mail enviado!</div>
            <div class="text-body2 text-grey-7 q-mb-lg">
              Se existe uma conta com o e-mail <strong>{{ form.email }}</strong>, você receberá o link em breve. Verifique também sua caixa de spam.
            </div>
            <q-btn flat no-caps label="Voltar para o login" color="primary" :to="{ name: 'login' }" />
          </div>

          <!-- Form state -->
          <q-form v-else class="rs-login-form" @submit="handleSubmit">
            <q-input
              v-model="form.email"
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

            <q-btn
              no-caps
              unelevated
              label="Enviar link de redefinição"
              color="primary"
              class="full-width rs-login-btn-submit"
              icon-right="send"
              type="submit"
              :loading="loading"
              :disabled="loading"
            />

            <q-btn
              flat
              no-caps
              label="Voltar para o login"
              color="grey-7"
              class="full-width"
              :to="{ name: 'login' }"
              icon-right="arrow_back"
            />
          </q-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { AuthService } from 'src/services/AuthService'
import useNotify from 'src/composables/showNotify'

defineOptions({ name: 'ForgotPasswordPage' })

const { notifyError } = useNotify()
const loading = ref(false)
const sent = ref(false)

const form = ref({ email: '' })

const handleSubmit = async () => {
  loading.value = true
  try {
    await AuthService.forgotPassword(form.value.email)
    sent.value = true
  } catch {
    // Generic message to avoid user enumeration
    notifyError('Ocorreu um erro ao processar a solicitação. Tente novamente.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
@import 'src/assets/pages/auth/login.scss';
</style>
