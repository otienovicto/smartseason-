import api from '../../services/api'

export async function getDashboard() {
  const resp = await api.get('/dashboard/')
  return resp.data
}

export default { getDashboard }
