import axios from 'axios'
import auth from './auth'

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
})

API.interceptors.request.use(config => {
  const token = window.localStorage.getItem(auth.storageTokenKeyName)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

API.interceptors.response.use(
  res => {
    return res
  },
  err => {
    if (err.response.status === 401) {
      window.localStorage.removeItem('admin')
      window.localStorage.removeItem('accessToken')
      window.location.replace('/login')
    }
  }
)

export default API
