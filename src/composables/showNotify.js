import { useQuasar } from 'quasar'

export default function useNotify() {
  const $q = useQuasar()

  const base = {
    position: 'top-right',
    timeout: 3500,
    progress: true,
    html: true,
  }

  const notifySuccess = (message) => {
    $q.notify({
      ...base,
      message,
      icon: 'check_circle',
      classes: 'rs-notify rs-notify--success',
      actions: [{ icon: 'close', flat: true, round: true, dense: true, color: 'grey-6' }],
    })
  }

  const notifyError = (message) => {
    $q.notify({
      ...base,
      message,
      icon: 'error',
      classes: 'rs-notify rs-notify--error',
      actions: [{ icon: 'close', flat: true, round: true, dense: true, color: 'grey-6' }],
    })
  }

  const notifyWarning = (message) => {
    $q.notify({
      ...base,
      message,
      icon: 'warning',
      classes: 'rs-notify rs-notify--warning',
      actions: [{ icon: 'close', flat: true, round: true, dense: true, color: 'grey-6' }],
    })
  }

  const notifyInfo = (message) => {
    $q.notify({
      ...base,
      message,
      icon: 'info',
      classes: 'rs-notify rs-notify--info',
      actions: [{ icon: 'close', flat: true, round: true, dense: true, color: 'grey-6' }],
    })
  }

  const notifyAlert = (message, icon) => {
    $q.notify({
      ...base,
      message,
      icon: icon || 'mood_bad',
      classes: 'rs-notify rs-notify--alert',
      actions: [{ icon: 'close', flat: true, round: true, dense: true, color: 'grey-6' }],
    })
  }

  return { notifySuccess, notifyError, notifyWarning, notifyInfo, notifyAlert }
}
