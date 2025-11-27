require('dotenv').config();
const nodemailer = require('nodemailer');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.warn('Mailer: SMTP configuration not found in environment. Emails will not be sent.');
}

let transporter;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: SMTP_HOST || 'smtp.example.com',
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

async function sendMail({ to, subject, text, html }) {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn('Mailer: skipping sendMail, SMTP env is not configured.');
    return false;
  }
  const tr = getTransporter();
  const from = FROM_EMAIL || SMTP_USER;
  try {
    const info = await tr.sendMail({ from, to, subject, text, html });
    console.log('Mailer: sent', info.messageId || info.response);
    return true;
  } catch (err) {
    console.error('Mailer: sendMail error', err && err.message ? err.message : err);
    return false;
  }
}

module.exports = { sendMail };
