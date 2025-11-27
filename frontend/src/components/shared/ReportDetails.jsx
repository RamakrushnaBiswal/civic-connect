import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function formatDate(d) {
  try {
    const date = new Date(d)
    return date.toLocaleString()
  } catch {
    return ''
  }
}

const Badge = ({ status }) => {
  const bg = status === 'resolved' || status === 'Resolved' ? 'bg-green-200 text-green-800' : status === 'in progress' || status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
  return <span className={`px-3 py-1 rounded-full text-sm ${bg}`}>{status}</span>
}

const TimelineItem = ({ date, title, message, author, isLast }) => (
  <div className="flex items-start gap-4">
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 rounded-full bg-blue-600"></div>
      {!isLast && <div className="w-px bg-gray-300 h-full mt-1"></div>}
    </div>
    <div className="pb-6">
      <div className="text-sm text-gray-500">{formatDate(date)}</div>
      <div className="font-medium text-gray-900">{title}</div>
      {message && <div className="text-gray-700 text-sm mt-1">{message}</div>}
      {author && <div className="text-xs text-gray-400 mt-1">By: {author}</div>}
    </div>
  </div>
)

const ReportDetails = () => {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchReport() {
      try {
        setIsLoading(true)
        const res = await fetch(`http://localhost:5000/api/reports/${id}`)
        if (!res.ok) {
          throw new Error(`Failed to load report: ${res.status}`)
        }
        const data = await res.json()
        setReport(data.report || data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReport()
  }, [id])

  if (isLoading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!report) return <div className="p-6">Report not found</div>

  // Build timeline: include creation and updates
  const timeline = []
  timeline.push({ date: report.createdAt || report._id?.getTimestamp?.() || new Date(), title: 'Report created', message: report.description })
  if (report.updates && Array.isArray(report.updates)) {
    // sort updates by date asc
    const sorted = [...report.updates].sort((a, b) => new Date(a.date) - new Date(b.date))
    sorted.forEach((u) => timeline.push({ date: u.date, title: u.message, message: null, author: u.author }))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{report.title}</h2>
          <Badge status={report.status || report.workflowStage || 'pending'} />
        </div>
        <div className="text-gray-700 mt-2">{report.location}</div>
        <div className="text-gray-800 mt-4">{report.description}</div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div><strong>Reported by:</strong> {report.name} ({report.email})</div>
          <div><strong>Phone:</strong> {report.phone}</div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Status Timeline</h3>
          <div className="border rounded p-4">
            {timeline.length === 0 && <div className="text-gray-500">No updates yet</div>}
            <div className="flex flex-col">
              {timeline.map((item, idx) => (
                <TimelineItem key={idx} date={item.date} title={item.title} message={item.message} author={item.author} isLast={idx === timeline.length - 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportDetails
