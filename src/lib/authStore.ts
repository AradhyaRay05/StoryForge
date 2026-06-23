import { create } from 'zustand'
import type { User } from './types'
import { api } from './api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('sf_user') || 'null'),
  isAuthenticated: !!localStorage.getItem('sf_access_token'),
  isLoading: false,

  login: (accessToken, refreshToken, user) => {
    localStorage.setItem('sf_access_token', accessToken)
    localStorage.setItem('sf_refresh_token', refreshToken)
    localStorage.setItem('sf_user', JSON.stringify(user))
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('sf_access_token')
    localStorage.removeItem('sf_refresh_token')
    localStorage.removeItem('sf_user')
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('sf_access_token')
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false })
      return
    }
    set({ isLoading: true })
    try {
      const { user } = await api.auth.getMe()
      localStorage.setItem('sf_user', JSON.stringify(user))
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('sf_access_token')
      localStorage.removeItem('sf_refresh_token')
      localStorage.removeItem('sf_user')
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))
