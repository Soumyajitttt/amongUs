import { create } from "zustand"

export const useAuthStore = create((set) => ({

  accessToken: null,
  user: null,

  setAuth: (token, user) =>
    set({
      accessToken: token,
      user
    }),

  logout: async () => {

    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      })
    } catch {}

    set({
      accessToken: null,
      user: null
    })
  }

}))