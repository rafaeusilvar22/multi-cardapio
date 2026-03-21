import { api } from "src/boot/axios";
import { errorsMiddleware } from "src/utils/errorMiddleware";
import { API_ENDPOINTS } from "./endpoints";

const BASE = API_ENDPOINTS.CATEGORIES;

export const CategoryService = {
  async getAll() {
    try {
      const resp = await api.get(`${BASE}/all`);
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

  async update(uuid, data) {
    try {
      const resp = await api.patch(`${BASE}/update/${uuid}`, data);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },

  async remove(uuid) {
    try {
      const resp = await api.delete(`${BASE}/delete/${uuid}`);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },
};
