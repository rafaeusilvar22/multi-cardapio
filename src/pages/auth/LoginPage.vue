<template>
  <q-page class="row full-height">
    <div class="gt-sm col-sm-6 flex flex-center rs-bg-auth"></div>

    <div class="col-xs-12 2 col-md-6 flex flex-center">
      <q-card class="q-pa-lg" style="width: 450px; max-width: 90%">
        <q-card-section>
          <q-img
            class="rs-logo-auth"
            src="https://img.freepik.com/free-vector/restaurant-mural-wallpaper_23-2148695092.jpg?semt=ais_hybrid&w=740&q=80"
          />
          <p class="lt-md rs-heading-m q-pt-md">Painel de Conflitos</p>
          <p class="lt-md rs-xl-regular">Área Administrativa</p>
          <div class="rs-heading-xs q-my-lg">Entrar</div>
          <q-form class="q-gutter-y-md" @submit="handleLogin">
            <q-input
              v-model="formData.email"
              borderless
              class="rs-input-base"
              dense
              type="email"
              label="Email"
              :rules="[(val) => (val && val.length > 0) || 'E-mail necessário']"
            />
            <q-input
              v-model="formData.password"
              borderless
              class="rs-input-base"
              dense
              label="Senha"
              type="password"
              :rules="[(val) => (val && val.length > 0) || 'Senha necessária']"
            />
            <q-btn
              no-caps
              unelevated
              label="Entrar"
              color="primary"
              class="full-width"
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
        </q-card-section>
      </q-card>
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
const router = useRouter()
const authStore = useAuthStore()
const { notifyError, notifySuccess } = useNotify()

const formData = ref({
  email: 'rafaelrodriguesdasilva72@gmail.com',
  password: 'Rafael22*',
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
<style lang="scss">
.rs-bg-auth {
  background: rgb(197, 57, 57) no-repeat center center;
  background-size: cover;
}
.rs-logo-auth {
  width: 100%;
  margin: 0 auto;
  max-width: 250px;
}
</style>
