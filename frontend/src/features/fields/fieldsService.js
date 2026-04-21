import api from '../../services/api'

export async function listFields() {
  const resp = await api.get('/fields/')
  return resp.data
}

export async function createField(data) {
  const resp = await api.post('/fields/', data)
  return resp.data
}

export async function updateField(id, data) {
  const resp = await api.patch(`/fields/${id}/`, data)
  return resp.data
}

export async function getField(id) {
  const resp = await api.get(`/fields/${id}/`)
  return resp.data
}

export async function listFieldUpdates(fieldId) {
  const resp = await api.get(`/fields/${fieldId}/updates/`)
  return resp.data
}

export async function createFieldUpdate(fieldId, data) {
  const resp = await api.post(`/fields/${fieldId}/updates/`, data)
  return resp.data
}

export async function listAgents() {
  const resp = await api.get('/users/')
  const users = resp.data || []
  return users.filter((u) => u.role && u.role.toUpperCase() === 'AGENT')
}

export default { listFields, createField, updateField, getField, listFieldUpdates, createFieldUpdate, listAgents }
