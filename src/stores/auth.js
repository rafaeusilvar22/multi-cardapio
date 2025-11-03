import { defineStore } from "pinia";
import { AuthService } from "src/services/AuthService";
import { cryptoJsEncrypt, cryptoJsDecrypt } from "src/utils/crypto";


export const useAuthStore = defineStore("auth", {
  // O Pinia já usa o sistema de reatividade do Vue para o state
  state: () => ({
    authUser: null, // O objeto de usuário criptografado
    authToken: null
  }),

  getters: {
    // 💡 A CHAVE: O Getter expõe o dado descriptografado.
    // Como o Pinia é reativo, sempre que state.authUser mudar, este getter é reavaliado.
    user: (state) => {
      if (!state.authUser) return null;
      // Retorna o objeto de usuário (descriptografado)
      return cryptoJsDecrypt(state.authUser);
    },
    token: (state) => state.authToken, // Mantenha o token criptografado
    isAuthenticated: (state) => !!state.authToken,
  },

  actions: {
    async login(form) {
      const { user, token, responseData } = await AuthService.login(form);

      this.authUser = cryptoJsEncrypt(user);
      this.authToken = cryptoJsEncrypt(token);

      return responseData;
    },

    async logout() {
      this.authToken = null;
      this.authUser = null;

    },

    async getUserProfile() {
      const decryptedToken = this.token;
      const resp = await AuthService.getUserProfile(decryptedToken);

      return resp.data;
    },

    async createNewUser(form) {
      const resp = await AuthService.createNewUser(form);
      return resp.data;
    }
  },
  persist: true,
});
