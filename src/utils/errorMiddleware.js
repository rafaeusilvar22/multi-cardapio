import useLoading from "src/composables/showLoading";
import { i18n } from "boot/i18n";
import { useAuthStore } from "src/stores/auth";
import { useGotoRouter } from "src/composables/goToRouter";
import { showAlertInfo } from "src/composables/showAlerts";

const { hideLoading } = useLoading();
const t = i18n.global.t;

export function errorsMiddleware(error) {  // ✅ Removido async
  hideLoading();

  const { handleGotoLoginLocation } = useGotoRouter();

  const DEFAULT_ERROR_MESSAGE = t(
    "An unexpected error has occurred. Please try again later."
  );

  const extractErrorMessage = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        return error.response.data.message || DEFAULT_ERROR_MESSAGE;
      }

      if (error.response.data && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map(
          (err) => err.isNotEmpty || err.isEnum || DEFAULT_ERROR_MESSAGE
        );
        return errorMessages[0] || DEFAULT_ERROR_MESSAGE;
      }

      return error.response.data.message || DEFAULT_ERROR_MESSAGE;
    }
    return error.message || DEFAULT_ERROR_MESSAGE;
  };

  const rawMessage = extractErrorMessage(error);
  // Translate if a key exists, otherwise use as-is
  const message = i18n.global.te(rawMessage) ? t(rawMessage) : rawMessage;

  if (error.response?.status === 401) {
    showAlertInfo(t("Warning"), message).then(() => {
      clearAuthentication(handleGotoLoginLocation);
    });
  }

  const err = new Error(message);
  err.statusCode = error.response?.status;
  err.code = error.code;
  throw err;
}

const clearAuthentication = (handleGotoLoginLocation) => {
  const auth = useAuthStore();
  auth.authToken = null;
  auth.authUser = null;
  handleGotoLoginLocation();
};
