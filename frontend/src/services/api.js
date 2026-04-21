import axios from 'axios'

// 🔥 Clean Vite-only env handling (no CRA fallback)
const baseURL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api'

// Axios instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// =========================
// GLOBAL REQUEST TRACKER
// =========================
let pendingCount = 0
const pendingListeners = new Set()

function notifyPending() {
  pendingListeners.forEach((cb) => {
    try {
      cb(pendingCount)
    } catch (e) {}
  })
}

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use(
  (config) => {
    pendingCount += 1
    notifyPending()

    // Attach token automatically if exists
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    pendingCount = Math.max(0, pendingCount - 1)
    notifyPending()
    return Promise.reject(error)
  }
)

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => {
    pendingCount = Math.max(0, pendingCount - 1)
    notifyPending()
    return response
  },
  (error) => {
    pendingCount = Math.max(0, pendingCount - 1)
    notifyPending()

    if (error?.response?.status === 401) {
      // clear auth
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      delete api.defaults.headers.common['Authorization']

      // redirect to login
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// =========================
// SUBSCRIPTIONS (LOADING UI)
// =========================
export function subscribePending(cb) {
  pendingListeners.add(cb)
  try {
    cb(pendingCount)
  } catch (e) {}

  return () => pendingListeners.delete(cb)
}

export function getPendingCount() {
  return pendingCount
}

// =========================
// AUTH HELPERS
// =========================
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('accessToken', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    localStorage.removeItem('accessToken')
    delete api.defaults.headers.common['Authorization']
  }
}

// =========================
// INIT AUTH ON LOAD
// =========================
(() => {
  try {
    const token = localStorage.getItem('accessToken')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  } catch (e) {}
})()

export default api
