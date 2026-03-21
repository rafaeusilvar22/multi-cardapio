import { api } from "src/boot/axios";
import { errorsMiddleware } from "src/utils/errorMiddleware";
import { API_ENDPOINTS } from "./endpoints";

const AUTH = API_ENDPOINTS.AUTH;
const USER = API_ENDPOINTS.USER;

export const AuthService = {
  async login(form) {
    try {
      const resp = await api.post(`${AUTH}/login`, form);
      return {
        user: resp.data.data.user,
        token: resp.data.data.token,
        responseData: resp.data
      };
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async logout() {
    try {
      const resp = await api.post(`${AUTH}/logout`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async getUserProfile() {
    try {
      const resp = await api.get(`${USER}/profile`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async createNewUser(form) {
    try {
      const resp = await api.post(`${USER}/create`, form);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async forgotPassword(email) {
    try {
      const resp = await api.post(`${USER}/forgot-password`, { email });
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async resetPassword(payload) {
    try {
      const resp = await api.post(`${USER}/reset-password`, payload);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },
};
