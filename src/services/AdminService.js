import { api } from 'src/boot/axios'
import { errorsMiddleware } from 'src/utils/errorMiddleware'
import { API_ENDPOINTS } from './endpoints'

const BASE = API_ENDPOINTS.ADMIN

export const AdminService = {
  // Workspaces
  async listWorkspaces(status) {
    try {
      const params = status ? { status } : {}
      const resp = await api.get(`${BASE}/workspaces`, { params })
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async getWorkspace(uuid) {
    try {
      const resp = await api.get(`${BASE}/workspaces/${uuid}`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async createWorkspace(data) {
    try {
      const resp = await api.post(`${BASE}/workspaces`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateWorkspace(uuid, data) {
    try {
      const resp = await api.patch(`${BASE}/workspaces/${uuid}`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateWorkspaceStatus(uuid, status) {
    try {
      const resp = await api.patch(`${BASE}/workspaces/${uuid}/status`, { status })
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateWorkspaceSettings(uuid, data) {
    try {
      const resp = await api.patch(`${BASE}/workspaces/${uuid}/settings`, data)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async listWorkspaceUsers(uuid) {
    try {
      const resp = await api.get(`${BASE}/workspaces/${uuid}/users`)
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  // Users
  async listUsers(params) {
    try {
      const resp = await api.get(`${BASE}/users`, { params })
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },

  async updateUserStatus(uuid, status) {
    try {
      const resp = await api.patch(`${BASE}/users/${uuid}/status`, { status })
      return resp.data
    } catch (error) {
      throw errorsMiddleware(error)
    }
  },
}
