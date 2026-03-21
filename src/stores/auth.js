import { defineStore } from 'pinia'
import { AuthService } from 'src/services/AuthService'
import { EstablishmentService } from 'src/services/EstablishmentService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null,
    authToken: null,
    authGroupUuid: null,
    authGroup: null,
    authProfile: null,
    authCustomizations: [],
  }),

  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken,
    decryptedToken: (state) => state.authToken,
    isAuthenticated: (state) => !!state.authToken,
    groupUuid: (state) => state.authGroupUuid,
    group: (state) => state.authGroup,
    profile: (state) => state.authProfile,

    // Retorna a customização ativa mais recente com cores definidas
    activeCustomization: (state) => {
      const list = state.authCustomizations || []
      const withColors = list.filter((c) => c.status === 'active' && c.primary_color)
      return withColors.at(-1) || list.at(-1) || null
    },
  },

  actions: {
    async login(form) {
      const { user, token, responseData } = await AuthService.login(form)

      this.authUser = user
      this.authToken = token

      try {
        const profileResp = await AuthService.getUserProfile()
        const profileData = profileResp?.data || profileResp

        this.authProfile = profileData

        let uuid = null
        if (profileData?.workspace_uuid) {
          uuid = profileData.workspace_uuid
        } else if (profileData?.group?.uuid) {
          uuid = profileData.group.uuid
        } else if (profileData?.group_uuid) {
          uuid = profileData.group_uuid
        }

        if (uuid) {
          this.authGroupUuid = uuid
          await this.fetchGroupData(uuid)
        }
      } catch {
        // profile/group fetch failed silently
      }

      return responseData
    },

    async fetchGroupData(uuid) {
      try {
        const resp = await EstablishmentService.getGroup(uuid)
        const data = resp?.data || resp
        this.authGroup = data?.workspace || data?.group || data
        this.authCustomizations = data?.customizations || []
      } catch {
        // group fetch failed silently
      }
    },

    async refreshGroupData() {
      if (this.authGroupUuid) {
        await this.fetchGroupData(this.authGroupUuid)
      }
    },

    async logout() {
      this.authToken = null
      this.authUser = null
      this.authGroupUuid = null
      this.authGroup = null
      this.authProfile = null
      this.authCustomizations = []
    },

    async getUserProfile() {
      const resp = await AuthService.getUserProfile()
      return resp.data
    },

    async createNewUser(form) {
      const resp = await AuthService.createNewUser(form)
      return resp.data
    },
  },
  persist: true,
})
