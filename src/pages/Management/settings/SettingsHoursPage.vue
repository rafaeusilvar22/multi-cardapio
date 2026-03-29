<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-lg-10">
        <div class="rs-page-header q-mb-lg">
          <div>
            <div class="text-caption text-grey-5 q-mb-xs">Configurações</div>
            <div class="rs-page-title">Horários</div>
            <div class="rs-page-subtitle">Defina os horários de funcionamento do estabelecimento</div>
          </div>
        </div>

        <q-card flat bordered class="settings-card q-pa-lg">
          <div class="section-title q-mb-lg">
            <q-icon name="schedule" size="20px" class="q-mr-sm" />Horário de Funcionamento
          </div>

          <div class="q-gutter-sm">
            <div
              v-for="day in workingHours"
              :key="day.day"
              class="working-hour-item"
              :class="{ 'working-hour-item--active': day.enabled, 'working-hour-item--dark': isDark }"
            >
              <div class="row items-center no-wrap">
                <div class="day-checkbox-col">
                  <q-checkbox
                    v-model="day.enabled"
                    :label="day.day"
                    class="text-weight-medium"
                  />
                </div>
                <div class="col">
                  <div class="row q-col-gutter-sm items-center">
                    <div class="col">
                      <q-input
                        v-model="day.open"
                        outlined
                        dense
                        placeholder="08:00"
                        mask="##:##"
                        :disable="!day.enabled"
                      >
                        <template v-slot:prepend>
                          <q-icon name="wb_sunny" size="16px" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col-auto">
                      <span class="text-grey-5 text-caption">—</span>
                    </div>
                    <div class="col">
                      <q-input
                        v-model="day.close"
                        outlined
                        dense
                        placeholder="18:00"
                        mask="##:##"
                        :disable="!day.enabled"
                      >
                        <template v-slot:prepend>
                          <q-icon name="nights_stay" size="16px" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn
              unelevated
              label="Salvar Horários"
              color="primary"
              icon="save"
              padding="10px 32px"
              @click="handleSaveHours"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Dark } from 'quasar'
import { EstablishmentService } from 'src/services/EstablishmentService'
import { useAuthStore } from 'src/stores/auth'
import useLoading from 'src/composables/showLoading'
import useNotify from 'src/composables/showNotify'

defineOptions({ name: 'SettingsHoursPage' })

const isDark = computed(() => Dark.isActive)

const { showLoading, hideLoading } = useLoading()
const { notifySuccess, notifyError } = useNotify()
const authStore = useAuthStore()

const defaultWorkingHours = () => [
  { day: 'Domingo', dayOfWeek: 0, enabled: false, open: '', close: '' },
  { day: 'Segunda-feira', dayOfWeek: 1, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Terça-feira', dayOfWeek: 2, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Quarta-feira', dayOfWeek: 3, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Quinta-feira', dayOfWeek: 4, enabled: true, open: '08:00', close: '18:00' },
  { day: 'Sexta-feira', dayOfWeek: 5, enabled: true, open: '08:00', close: '20:00' },
  { day: 'Sábado', dayOfWeek: 6, enabled: true, open: '09:00', close: '15:00' },
]

const workingHours = ref(defaultWorkingHours())

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

const handleSaveHours = async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) {
    notifyError('Grupo não identificado.')
    return
  }

  showLoading()
  try {
    const business_hours = workingHours.value.map((day) => ({
      day_of_week: day.dayOfWeek,
      is_closed: !day.enabled,
      open_time: day.enabled ? day.open : null,
      close_time: day.enabled ? day.close : null,
    }))

    await EstablishmentService.updateSettings(groupUuid, { business_hours })
    await syncStore()
    notifySuccess('Horários salvos com sucesso!')
  } catch {
    notifyError('Erro ao salvar horários')
  } finally {
    hideLoading()
  }
}

onMounted(async () => {
  const groupUuid = authStore.groupUuid
  if (!groupUuid) return

  showLoading()
  try {
    const hoursResp = await EstablishmentService.getBusinessHours(groupUuid)
    const apiHours = hoursResp?.data || hoursResp || []
    if (Array.isArray(apiHours) && apiHours.length > 0) {
      const hours = defaultWorkingHours()
      apiHours.forEach((bh) => {
        const dayEntry = hours.find((d) => d.dayOfWeek === bh.day_of_week)
        if (dayEntry) {
          dayEntry.enabled = !bh.is_closed
          dayEntry.open = bh.open_time?.slice(0, 5) || ''
          dayEntry.close = bh.close_time?.slice(0, 5) || ''
        }
      })
      workingHours.value = hours
    }
  } catch {
    notifyError('Erro ao carregar horários')
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

.day-checkbox-col {
  width: 148px;
  flex-shrink: 0;
}

.working-hour-item {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-left: 3px solid #e0e0e0;
  transition: all 0.2s;

  &--active {
    border-color: rgba(0, 0, 0, 0.06);
    border-left-color: var(--q-primary);
    background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.04);
  }

  &--dark {
    background: #242424;
    border-color: transparent;
    border-left-color: #3a3a3a;

    &.working-hour-item--active {
      background: rgba(var(--q-primary-rgb, 25, 118, 210), 0.1);
      border-left-color: var(--q-primary);
    }
  }
}
</style>
