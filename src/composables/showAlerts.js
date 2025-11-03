import Swal from "sweetalert2";
import { nextTick } from "vue";

// Start Show Alert
export function showAlert(title, html, icon, focus, allowOutsideClick) {
  if (focus !== "") {
    nextTick(() => focus.value.focus());
  }
  return Swal.fire({
    icon,
    title,
    html,
    allowOutsideClick,
    customClass: {
      popup: "rc-sweet-alert",
      confirmButton: "rc-button-sweet-alert-confirm",
    },
    buttonsStyling: false,
  });
}

export function showAlertError(title, html) {
  return showAlert(title, html, "error", "", false);
}

export function showAlertSuccess(title, html) {
  return showAlert(title, html, "success", "", false);
}

export function showAlertInfo(title, html) {
  return showAlert(title, html, "info", "", false);
}

export function showAlertWarning(title, html) {
  return showAlert(title, html, "warning", "", false);
}

export function showAlertQuestion(title, html) {
  return showAlert(title, html, "question", "", false);
}
// End Show Alert

// Start Show Confirmation
export async function showConfirmation(
  title,
  html,
  icon,
  allowOutsideClick,
  confirmButtonText,
  cancelButtonText
) {
  const alert = Swal.mixin({
    buttonsStyling: true,
    customClass: {
      popup: "rc-sweet-alert",
      confirmButton: "rc-button-sweet-alert-confirm",
      cancelButton: "rc-button-sweet-alert-cancel",
      actions: "rc-sweet-alert-actions",
    },
  });
  const resp = await alert
    .fire({
      title,
      icon,
      html,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      allowOutsideClick,
    })
    .then((result) => {
      return result.isConfirmed;
    });
  return resp;
}

export async function showAlertConfirmationQuestion(
  title,
  html,
  confirmButtonText,
  cancelButtonText
) {
  return await showConfirmation(
    title,
    html,
    "question",
    false,
    confirmButtonText,
    cancelButtonText
  );
}

export async function showAlertConfirmationInfo(
  title,
  html,
  confirmButtonText,
  cancelButtonText
) {
  return await showConfirmation(
    title,
    html,
    "info",
    false,
    confirmButtonText,
    cancelButtonText
  );
}

export async function showAlertConfirmationWarning(
  title,
  html,
  confirmButtonText,
  cancelButtonText
) {
  return await showConfirmation(
    title,
    html,
    "warning",
    false,
    confirmButtonText,
    cancelButtonText
  );
}
// End Show Confirmation
