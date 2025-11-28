import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WorkerLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('http://localhost:5000/api/personnel/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      localStorage.setItem('personnel_token', data.token)
      localStorage.setItem('personnel', JSON.stringify(data.personnel))
      if (data.personnel && data.personnel.mustChangePassword) {
        navigate('/owner/change-password')
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
        <h2 className="text-xl font-bold mb-4">Worker Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm">Email</label>
            <input className="w-full p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="block text-sm">Password</label>
            <input type="password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? 'Logging in...' : 'Login'}</button>
          <div className="mt-3 text-center">
            <a className="text-sm text-blue-600 hover:underline" href="/owner/request-reset">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WorkerLogin
