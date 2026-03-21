import { api } from "src/boot/axios";
import { errorsMiddleware } from "src/utils/errorMiddleware";
import { API_ENDPOINTS } from "./endpoints";

const BASE = API_ENDPOINTS.ORDERS;

export const OrderService = {
  async getAll(filters = {}) {
    try {
      const resp = await api.get(`${BASE}/all`, { params: filters });
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async getOne(uuid) {
    try {
      const resp = await api.get(`${BASE}/${uuid}`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async create(data) {
    try {
      const resp = await api.post(`${BASE}/create`, data);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async updateStatus(uuid, status) {
    try {
      const resp = await api.patch(`${BASE}/${uuid}/status`, { status });
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async cancel(uuid) {
    try {
      const resp = await api.delete(`${BASE}/${uuid}`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async getDashboard() {
    try {
      const resp = await api.get(`${BASE}/dashboard`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },
};
