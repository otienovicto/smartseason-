import React, { useEffect, useState } from 'react'
import { listUsers, createUser, updateUser, deleteUser } from '../features/users/usersService'

export default function AdminPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', email: '', name: '', role: 'AGENT' })
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    setError(null)
    try {
      const data = await listUsers()
      setUsers(data)
    } catch (e) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    try {
      await createUser(form)
      setForm({ username: '', password: '', email: '', name: '', role: 'AGENT' })
      fetchUsers()
    } catch (err) {
      setError('Failed to create user')
    }
  }

  const [editingUserId, setEditingUserId] = useState(null)
  const [editForm, setEditForm] = useState({ username: '', name: '', email: '', role: 'AGENT', password: '' })
  const [editError, setEditError] = useState(null)

  function startEdit(u) {
    setEditingUserId(u.id)
    setEditForm({ username: u.username || '', name: u.name || '', email: u.email || '', role: u.role || 'AGENT', password: '' })
    setEditError(null)
  }

  function cancelEdit() {
    setEditingUserId(null)
    setEditForm({ username: '', name: '', email: '', role: 'AGENT', password: '' })
    setEditError(null)
  }

  async function saveEdit(e) {
    e.preventDefault()
    setEditError(null)
    try {
      const payload = { name: editForm.name, email: editForm.email, role: editForm.role }
      if (editForm.password) payload.password = editForm.password
      await updateUser(editingUserId, payload)
      cancelEdit()
      fetchUsers()
    } catch (err) {
      setEditError('Failed to update user')
    }
  }

  async function handleDelete(u) {
    if (!window.confirm(`Delete user ${u.username || u.email || u.id}?`)) return
    try {
      await deleteUser(u.id)
      fetchUsers()
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Admin — Users</h1>
          <div className="subtitle">Manage accounts and roles for your organization</div>
        </div>
        <div>
          <button className="btn" onClick={fetchUsers}>{loading ? 'Refreshing...' : 'Refresh'}</button>
        </div>
      </div>

      <div className="card-row">
        <div className="card" style={{ flex: 1, maxWidth: 420 }}>
          <h3 style={{ marginTop: 0 }}>Create User</h3>
          <form onSubmit={handleCreate} className="form">
            <div className="field"><label>Username</label><input className="input" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></div>
            <div className="field"><label>Name</label><input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="field"><label>Email</label><input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="field"><label>Password</label><input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
            <div className="field"><label>Role</label><select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="AGENT">Agent</option><option value="ADMIN">Admin</option></select></div>
            {error && <div className="muted" style={{ color: 'red' }}>{error}</div>}
            <div className="actions"><button className="btn btn-primary" type="submit">Create User</button></div>
          </form>
        </div>

        <div style={{ flex: 2 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>All Users</h3>
            </div>
            {loading && <div className="muted">Loading...</div>}
            {!loading && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    editingUserId === u.id ? (
                      <tr key={u.id}>
                        <td><input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                        <td>{u.username}</td>
                        <td><input className="input" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /></td>
                        <td>
                          <select className="select" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                            <option value="AGENT">Agent</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          <div style={{ marginTop: 6 }}>
                            <input className="input" placeholder="New password (optional)" type="password" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} />
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                            <button className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
                          </div>
                          {editError && <div className="muted" style={{ color: 'red' }}>{editError}</div>}
                        </td>
                      </tr>
                    ) : (
                      <tr key={u.id}>
                        <td>{u.name || '-'}</td>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>{u.role || (u.is_superuser ? 'ADMIN' : '-')}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-ghost" onClick={() => startEdit(u)}>Edit</button>
                            <button className="btn btn-ghost" onClick={() => handleDelete(u)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
