import { api } from "src/boot/axios";
import { errorsMiddleware } from "src/utils/errorMiddleware";

const BASE_URL = process.env.BACK_END_BASE_URL;

export const AuthService = {
  async login(form) {
    try {
      const resp = await api.post(`${BASE_URL}/auth/login`, form);
      return {
        user: resp.data.data.user,
        token: resp.data.data.token,
        responseData: resp.data
      };
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async logout(token) {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const resp = await api.post(`${BASE_URL}/auth/logout`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async getUserProfile(token) {
    try {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      const resp = await api.get(`${BASE_URL}/user/user-profile`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },
  async createNewUser(form) {
    try {
      const resp = await api.post(`${BASE_URL}/user/create`, form);
      return resp.data;
    } catch (error) {
      await errorsMiddleware(error);
    }
  }
};
