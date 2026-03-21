import { useQuasar } from 'quasar'

export default function useConfirmDialog() {
  const $q = useQuasar()

  const confirm = ({ title, message, okLabel = 'Confirmar', cancelLabel = 'Cancelar', okColor = 'primary' } = {}) => {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        html: true,
        cancel: {
          label: cancelLabel,
          flat: true,
          color: 'grey-7',
        },
        ok: {
          label: okLabel,
          unelevated: true,
          color: okColor,
        },
        persistent: true,
      })
        .onOk(() => resolve(true))
        .onCancel(() => resolve(false))
    })
  }

  return { confirm }
}
