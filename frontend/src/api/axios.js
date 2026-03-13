import axios from "axios"
import { useAuthStore } from "../store/authStore"

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true
})

/* attach access token */

api.interceptors.request.use((config) => {

  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



/* auto refresh token */

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true

      try {

        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh",
          {},
          { withCredentials: true }
        )

        const newToken = res.data.accessToken

        useAuthStore.getState().setAuth(newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)

      } catch (err) {

        useAuthStore.getState().logout()

        return Promise.reject(err)

      }

    }

    return Promise.reject(error)

  }

)

export default api