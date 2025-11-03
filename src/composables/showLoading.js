import { Loading, QSpinnerIos } from "quasar";

export default function useLoading() {
  const showLoading = (spinnerColor) => {
    // fully customizable
    Loading.show({
      spinner: QSpinnerIos,
      spinnerColor: spinnerColor || "primary",
    });
  };

  const hideLoading = () => {
    Loading.hide();
  };

  return {
    showLoading,
    hideLoading,
  };
}
