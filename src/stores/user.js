import { defineStore } from "pinia";
import { api } from "src/boot/axios";
import { errorsMiddleware } from "src/utils/errorMiddleware";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null
  }),

  actions: {
    async createNewUser(form) {
      try {
        const resp = await api.post(
          `${process.env.BACK_END_BASE_URL}/user/create`,
          form
        );
        return resp.data;
      } catch (error) {
        return errorsMiddleware(error);
      }
    },

    async checkEmail(email) {
      try {
        const resp = await api.get(
          `${process.env.BACK_END_BASE_URL}/user/check-email-already-registered/${email}`
        );
        return resp.data;
      } catch (error) {
        return errorsMiddleware(error);
      }
    },

    async activateAccountCode(form) {
      try {
        const resp = await api.put(
          `${process.env.BACK_END_BASE_URL}/user/activate-account-code/${form.email}/${form.code}/${form.uuid}/${form.id}`,
        );
        return resp.data;
      } catch (error) {
        return errorsMiddleware(error);
      }
    },

    async resendCode(form) {
      try {
        const resp = await api.put(
          `${process.env.BACK_END_BASE_URL}/user/resend-activation-code/${form.email}/${form.uuid}/${form.id}`,
        );
        return resp.data;
      } catch (error) {
        return errorsMiddleware(error);
      }
    },
    async uploadProfileImage(payload) {
      try {
        const formData = new FormData();
        formData.append('file', payload.file, payload.file.name);
        const url = `${process.env.BACK_END_BASE_URL}/user/upload-profile-image/${payload.userUuid}/${payload.userId}`;
        const resp = await api.post(url, formData);
        if (resp.data.data?.user) {
          this.user = resp.data.data.user;
        }
        return resp.data;
      } catch (error) {
        return errorsMiddleware(error);
      }
    },
  },
  persist: false,
});
