require('dotenv').config()
const nodemailer = require('nodemailer')

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL, TEST_TO } = process.env

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.error('Missing SMTP configuration in env. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS')
  process.exit(1)
}

async function sendTest() {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  })

  const from = FROM_EMAIL || SMTP_USER
  const to = TEST_TO || SMTP_USER

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Civic-Connect Test Email',
      text: 'This is a test email from your Civic-Connect backend using provided SMTP credentials.',
      html: '<p>This is a <strong>test</strong> email from your Civic-Connect backend using provided SMTP credentials.</p>'
    })
    console.log('Email sent:', info.response || info.messageId)
  } catch (err) {
    console.error('Failed to send test email:', err)
    process.exit(2)
  }
}

sendTest()
