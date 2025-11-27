import React, { useState } from 'react'

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = { name: form.name, email: form.email, message: form.message }
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`Failed to send message (${res.status})`)
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Contact Us</h2>
        <p className="text-sm text-gray-600">Have questions or feedback? Send us a message and we'll get back to you.</p>

        {success && <div className="p-2 bg-green-100 text-green-800">Message sent successfully.</div>}
        {error && <div className="p-2 bg-red-100 text-red-800">{error}</div>}

        <div>
          <label className="block text-gray-700">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded" required />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded" required />
        </div>

        <div>
          <label className="block text-gray-700">Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded" rows={5} required />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition">
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}

export default ContactUs
