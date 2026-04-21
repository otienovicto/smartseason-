import axios from 'axios'

const base = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8008/api'

const api = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

let pendingCount = 0
const pendingListeners = new Set()

function notifyPending() {
  pendingListeners.forEach((cb) => {
    try { cb(pendingCount) } catch (e) {}
  })
}

api.interceptors.request.use(
  (cfg) => {
    pendingCount += 1
    notifyPending()
    return cfg
  },
  (err) => {
    pendingCount = Math.max(0, pendingCount - 1)
    notifyPending()
    return Promise.reject(err)
  }
)

api.interceptors.response.use(
  (resp) => {
    pendingCount = Math.max(0, pendingCount - 1)
    notifyPending()
    return resp
  },
  (err) => {
    pendingCount = Math.max(0, pendingCount - 1)
    notifyPending()
    if (err && err.response) {
      const { status } = err.response
      if (status === 401) {
        try {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        } catch (e) {}
        delete api.defaults.headers.common['Authorization']
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export function subscribePending(cb) {
  pendingListeners.add(cb)
  try { cb(pendingCount) } catch (e) {}
  return () => pendingListeners.delete(cb)
}

export function getPendingCount() {
  return pendingCount
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    try { localStorage.setItem('accessToken', token) } catch (e) {}
  } else {
    delete api.defaults.headers.common['Authorization']
    try { localStorage.removeItem('accessToken') } catch (e) {}
  }
}

// initialize from storage
try {
  const t = localStorage.getItem('accessToken')
  if (t) api.defaults.headers.common['Authorization'] = `Bearer ${t}`
} catch (e) {}

export default api
