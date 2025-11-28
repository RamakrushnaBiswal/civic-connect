import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const WorkerDashboard = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const token = localStorage.getItem('personnel_token')
  const navigate = useNavigate()

  const fetchReports = async () => {
    if (!token) return setError('Not authenticated')
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/reports/assigned', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed to fetch reports')
      const data = await res.json()
      setReports(data.reports || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (!token) navigate('/owner/login'); else fetchReports() }, [])

  const logout = () => {
    localStorage.removeItem('personnel_token')
    localStorage.removeItem('personnel')
    window.location.assign('/owner/login')
  }

  const updateStatus = async (id, status) => {
    try {
      const note = `Updated by worker`;
      const res = await fetch(`http://localhost:5000/api/reports/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, note })
      })
      if (!res.ok) throw new Error('Failed to update status')
      await fetchReports()
    } catch (err) { console.error(err); setError(err.message) }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id)

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Assigned Reports</h2>
        <button onClick={logout} className="bg-gray-200 text-gray-800 px-3 py-1 rounded">Logout</button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Assigned Reports</h2>
      <div className="space-y-4">
        {reports.map(r => (
          <div className="bg-white p-4 rounded shadow" key={r.id || r._id}>
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="font-semibold text-lg">{r.title}</div>
                <div className="text-sm text-gray-500">{r.location} • {new Date(r.createdAt).toLocaleString()}</div>
                <div className="mt-2 flex gap-3 items-center text-sm">
                  <div className="text-gray-700">{r.status || r.workflowStage}</div>
                  <div className="text-gray-500">{r.priority}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button onClick={() => toggleExpand(r.id || r._id)} className="text-blue-600 hover:underline">{expandedId === (r.id || r._id) ? 'Hide details' : 'Show details'}</button>
                <div className="flex items-center gap-2">
                  <select onChange={(e) => updateStatus(r.id || r._id, e.target.value)} defaultValue="" className="border rounded p-1">
                    <option value="">Update</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
            {expandedId === (r.id || r._id) && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium">Contact</h4>
                  <p className="text-sm text-gray-700">{r.name}</p>
                  {r.email && (
                    <p className="text-sm text-gray-700"><a className="text-blue-600 hover:underline" href={`mailto:${r.email}`}>{r.email}</a></p>
                  )}
                  {r.phone && (
                    <p className="text-sm text-gray-700"><a className="text-blue-600 hover:underline" href={`tel:${r.phone}`}>{r.phone}</a></p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Deadline</h4>
                  <p className="text-sm text-gray-700">{r.slaDeadline ? new Date(r.slaDeadline).toLocaleString() : 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-sm text-gray-700">{r.location}</p>
                  {r.coordinates && r.coordinates.lat && r.coordinates.lng && (
                    <div className="mt-2">
                      <a target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm mr-2" href={`https://www.google.com/maps/search/?api=1&query=${r.coordinates.lat},${r.coordinates.lng}`}>Open in Google Maps</a>
                      <a target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm" href={`https://www.openstreetmap.org/?mlat=${r.coordinates.lat}&mlon=${r.coordinates.lng}#map=18/${r.coordinates.lat}/${r.coordinates.lng}`}>Open in OpenStreetMap</a>
                      <div className="mt-2">
                        <iframe title="map" src={`https://www.openstreetmap.org/export/embed.html?bbox=${(r.coordinates.lng-0.005).toFixed(6)},${(r.coordinates.lat-0.005).toFixed(6)},${(r.coordinates.lng+0.005).toFixed(6)},${(r.coordinates.lat+0.005).toFixed(6)}&layer=mapnik&marker=${r.coordinates.lat},${r.coordinates.lng}`} style={{ width: '100%', minHeight: '150px', border: '1px solid #ddd' }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkerDashboard
