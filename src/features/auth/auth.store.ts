import { create } from "zustand"
import type { User } from "@/types"

type AuthStore = {
  user: User | null
  isAuthChecked: boolean
  setUser: (user: User | null) => void
  setIsAuthChecked: (value: boolean) => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isAuthChecked: false,

  setUser: (user) => set({ user }),

  setIsAuthChecked: (value) => set({ isAuthChecked: value }),

  isAuthenticated: () => get().user !== null,
}))