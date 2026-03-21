import { api } from "src/boot/axios";
import { errorsMiddleware } from "src/utils/errorMiddleware";
import { API_ENDPOINTS } from "./endpoints";

const BASE = API_ENDPOINTS.PRODUCTS;

export const ProductService = {
  async getAll(params = {}) {
    try {
      const resp = await api.get(`${BASE}/all`, { params });
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

  async updateStatus(uuid, status) {
    try {
      const resp = await api.patch(`${BASE}/update/${uuid}/status`, { status });
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

  async uploadImage(uuid, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resp = await api.post(`${BASE}/${uuid}/upload/image`, formData);
      return resp.data;
    } catch (error) {
      throw errorsMiddleware(error);
    }
  },
};
