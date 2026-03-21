import { useQuasar } from "quasar";

export default function useNotify() {
  const $q = useQuasar();

  const notifySuccess = (message, position) => {
    $q.notify({
      message: message,
      html: true,
      classes: "bg-success-notify",
      position,
      icon: "check_circle",
      actions: [
        {
          icon: "close",
          color: "green-6",
          round: true,
          handler: () => {
            /* ... */
          },
        },
      ],
    });
  };

  const notifyError = (message, position) => {
    $q.notify({
      message: message,
      html: true,
      classes: "bg-error-notify",
      position,
      icon: "error",
      actions: [
        {
          icon: "close",
          color: "red-5",
          round: true,
          handler: () => {
            /* ... */
          },
        },
      ],
    });
  };

  const notifyWarning = (message, position) => {
    $q.notify({
      message: message,
      html: true,
      classes: "bg-warning-notify",
      position,
      icon: "warning",
      actions: [
        {
          icon: "close",
          color: "yellow-9",
          round: true,
          handler: () => {
            /* ... */
          },
        },
      ],
    });
  };

  const notifyAlert = (message, position, icon) => {
    $q.notify({
      message: message,
      html: true,
      position,
      classes: "sci-alert-notify",
      icon: icon || "mood_bad",
      textColor: "yellow-9",
      actions: [
        {
          icon: "close",
          color: "yellow-9",
          round: true,
          handler: () => {
            /* ... */
          },
        },
      ],
    });
  };

  const notifyInfo = (message, position) => {
    $q.notify({
      html: true,
      message: message,
      classes: "bg-info-notify",
      position,
      icon: "info",
      actions: [
        {
          icon: "close",
          color: "blue-5",
          round: true,
          handler: () => {
            /* ... */
          },
        },
      ],
    });
  };

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyAlert,
  };
}
