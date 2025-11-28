import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const WorkerChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const t = params.get('token')
    if (t) setToken(t)
  }, [location.search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let res
      if (token) {
        res = await fetch('http://localhost:5000/api/personnel/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, newPassword })
        })
      } else {
        const authToken = localStorage.getItem('personnel_token')
        if (!authToken) throw new Error('Not authenticated')
        res = await fetch('http://localhost:5000/api/personnel/me/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
          body: JSON.stringify({ oldPassword, newPassword })
        })
      }
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to change password')
      }
      // If token-based reset, clean localStorage and go to login
      if (token) {
        navigate('/owner/login')
      } else {
        navigate('/owner/dashboard')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">{token ? 'Set New Password' : 'Change Password'}</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!token && (
            <div className="mb-3">
              <label className="block text-sm">Old Password (if prompted)</label>
              <input type="password" className="w-full p-2 border rounded" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </div>
          )}
          <div className="mb-3">
            <label className="block text-sm">New Password</label>
            <input type="password" className="w-full p-2 border rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Updating...' : (token ? 'Set Password' : 'Change password')}</button>
        </form>
      </div>
    </div>
  )
}

export default WorkerChangePassword
