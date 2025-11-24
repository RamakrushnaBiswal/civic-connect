const Feedback = require('../models/Feedback')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer')

const createTransporterIfConfigured = () => {
  // Read and normalize env vars (trim to avoid stray spaces)
  let { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env
  SMTP_HOST = SMTP_HOST ? SMTP_HOST.trim() : ''
  SMTP_PORT = SMTP_PORT ? SMTP_PORT.trim() : ''
  SMTP_USER = SMTP_USER ? SMTP_USER.trim() : ''
  SMTP_PASS = SMTP_PASS ? SMTP_PASS.trim() : ''
  FROM_EMAIL = FROM_EMAIL ? FROM_EMAIL.trim() : ''

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    // Log which parts are missing (mask password)
    const mask = (s) => (s ? (s.length > 4 ? `${s.slice(0,2)}...${s.slice(-2)}` : '****') : '<missing>')
    console.log('SMTP configuration missing or incomplete:', {
      SMTP_HOST: SMTP_HOST || '<missing>',
      SMTP_PORT: SMTP_PORT || '<missing>',
      SMTP_USER: SMTP_USER ? mask(SMTP_USER) : '<missing>',
      SMTP_PASS: SMTP_PASS ? mask(SMTP_PASS) : '<missing>',
      FROM_EMAIL: FROM_EMAIL || '<missing>'
    })
    return null
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    })
    // Verify transporter (non-blocking): verify returns a promise
    transporter.verify().then(() => {
      console.log('SMTP transporter verified for host', SMTP_HOST)
    }).catch((err) => {
      console.warn('SMTP transporter verification failed (will attempt send):', err && err.message ? err.message : err)
    })
    return transporter
  } catch (err) {
    console.error('Failed to create SMTP transporter', err)
    return null
  }
}

const sendEmailNotification = async ({ to, subject, text, html }) => {
  const transporter = createTransporterIfConfigured()
  const from = process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com'
  if (!transporter) {
    console.log('SMTP not configured; skipping email to', to)
    return
  }
  try {
    await transporter.sendMail({ from, to, subject, text, html })
  } catch (err) {
    console.error('Failed to send email', err)
  }
}

exports.listFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 })
    res.json({ feedbacks })
  } catch (err) {
    console.error('Error listing feedbacks', err)
    res.status(500).json({ error: 'Failed to list feedbacks' })
  }
}

exports.createFeedback = async (req, res) => {
  try {
    const { userId, name, email, message, rating, metadata } = req.body
    if (!name || !message) return res.status(400).json({ error: 'name and message are required' })

    const feedback = new Feedback({
      id: uuidv4(),
      userId: userId || null,
      name,
      email: email || null,
      message,
      rating: rating || undefined,
      metadata: metadata || {},
    })

    await feedback.save()
    res.status(201).json({ feedback })
  } catch (err) {
    console.error('Error creating feedback', err)
    res.status(500).json({ error: 'Failed to create feedback' })
  }
}

exports.resolveFeedback = async (req, res) => {
  try {
    const id = req.params.id
    const { resolutionNotes } = req.body
    const fb = await Feedback.findOne({ id })
    if (!fb) return res.status(404).json({ error: 'Feedback not found' })
    fb.resolved = true
    fb.resolutionNotes = resolutionNotes || ''
    await fb.save()
    res.json({ feedback: fb })
  } catch (err) {
    console.error('Error resolving feedback', err)
    res.status(500).json({ error: 'Failed to resolve feedback' })
  }
}

exports.addComment = async (req, res) => {
  try {
    const id = req.params.id
    const { author, message, resolved, resolutionNotes } = req.body
    if (!message) return res.status(400).json({ error: 'message is required' })
    const fb = await Feedback.findOne({ id })
    if (!fb) return res.status(404).json({ error: 'Feedback not found' })

    fb.comments = fb.comments || []
    fb.comments.push({ author: author || 'Admin', message, date: new Date() })

    if (resolved) {
      fb.resolved = true
      if (resolutionNotes) fb.resolutionNotes = resolutionNotes
    }

    await fb.save()

    // send email notification to feedback submitter if email present
    if (fb.email) {
      const subject = `Update on your feedback: ${fb.id}`
      const text = `Hello ${fb.name},\n\nAn administrator (${author || 'Admin'}) has commented on your feedback:\n\n"${message}"\n\nStatus: ${fb.resolved ? 'Resolved' : 'Open'}\n\nThank you.`
      const html = `<p>Hello ${fb.name},</p><p>An administrator <strong>${author || 'Admin'}</strong> has commented on your feedback:</p><blockquote>${message}</blockquote><p>Status: <strong>${fb.resolved ? 'Resolved' : 'Open'}</strong></p><p>Thank you.</p>`
      sendEmailNotification({ to: fb.email, subject, text, html }).catch((e) => console.warn('email error', e))
    }

    res.json({ feedback: fb })
  } catch (err) {
    console.error('Error adding comment to feedback', err)
    res.status(500).json({ error: 'Failed to add comment' })
  }
}

exports.deleteFeedback = async (req, res) => {
  try {
    const id = req.params.id
    const fb = await Feedback.findOneAndDelete({ id })
    if (!fb) return res.status(404).json({ error: 'Feedback not found' })
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting feedback', err)
    res.status(500).json({ error: 'Failed to delete feedback' })
  }
}
