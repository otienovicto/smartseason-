import api from '../../services/api'

export async function listUsers() {
  const resp = await api.get('/users/')
  return resp.data
}

export async function createUser(data) {
  // expected: { username, password, email, name, role }
  const resp = await api.post('/users/register/', data)
  return resp.data
}

export async function updateUser(id, data) {
  const resp = await api.patch(`/users/${id}/`, data)
  return resp.data
}

export async function deleteUser(id) {
  const resp = await api.delete(`/users/${id}/`)
  return resp.data
}

export default { listUsers, createUser, updateUser, deleteUser }
