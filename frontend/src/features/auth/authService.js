import api, { setAuthToken } from '../../services/api'

export async function login(credentials) {
  // credentials: { username, password }
  const resp = await api.post('/auth/login/', credentials)
  const { access, refresh } = resp.data
  setAuthToken(access)
  try {
    localStorage.setItem('refreshToken', refresh)
  } catch (e) {}
  // fetch current user
  const userResp = await api.get('/users/me/')
  return { user: userResp.data, tokens: { access, refresh } }
}

export function logout() {
  setAuthToken(null)
  try {
    localStorage.removeItem('refreshToken')
  } catch (e) {}
}
