import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setReports([])
      setLoading(false)
      return
    }
    const token = localStorage.getItem('token')
    const fetchMyReports = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:5000/api/reports/my-reports', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(`Failed to load reports: ${res.status}`)
        const data = await res.json()
        setReports(data.reports || [])
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMyReports()
  }, [user])

  if (!user) return <div className="p-6">Please sign in to view your dashboard.</div>
  if (loading) return <div className="p-6">Loading your reports...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Reports</h2>
      {reports.length === 0 && <div className="text-gray-500">No reports found</div>}
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id || r._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-600">{r.location} • {new Date(r.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700">Status: <strong>{r.status || r.workflowStage}</strong></div>
              <Link to={`/reports/${r.id || r._id}`} className="bg-blue-600 text-white px-3 py-1 rounded">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
