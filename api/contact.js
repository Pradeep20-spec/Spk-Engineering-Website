import nodemailer from 'nodemailer'

const MAX_BODY_BYTES = 10_000
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function readBody(req) {
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) throw new Error('Message is too large.')
    return JSON.parse(raw)
  }

  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw new Error('Message is too large.')
    chunks.push(chunk)
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function respond(res, status, payload) {
  res.setHeader('Cache-Control', 'no-store')
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export default async function contactHandler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return respond(res, 405, { message: 'Use the contact form to send a message.' })
  }

  let body
  try {
    body = await readBody(req)
  } catch {
    return respond(res, 400, { message: 'Please check the form and try again.' })
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return respond(res, 400, { message: 'Please check the form and try again.' })
  }

  // Quietly accept bot submissions to avoid revealing the honeypot.
  if (typeof body.website === 'string' && body.website.trim()) {
    return respond(res, 200, { message: 'Your message has been sent.' })
  }

  const name = typeof body.name === 'string' ? body.name.replace(/[\r\n]+/g, ' ').trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!name || name.length > 100 || !emailPattern.test(email) || email.length > 254 || !message || message.length > 4000) {
    return respond(res, 400, { message: 'Enter your name, a valid email address, and a message under 4,000 characters.' })
  }

  const user = process.env.SMTP_USER
  const password = process.env.SMTP_PASS
  const recipient = process.env.CONTACT_TO || 'spk.engineering@yahoo.co.in'
  if (!user || !password) {
    return respond(res, 503, { message: 'The message form is not configured yet. Please call or email us directly.' })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mail.yahoo.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: (Number(process.env.SMTP_PORT) || 465) === 465,
      auth: { user, pass: password },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    })

    await transporter.sendMail({
      from: `SPK Engineering Website <${user}>`,
      to: recipient,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nReply to this enquiry by emailing ${email}.`,
    })

    return respond(res, 200, { message: 'Your message has been sent.' })
  } catch (error) {
    console.error('Contact email delivery failed:', error?.message || 'Unknown mail error')
    return respond(res, 502, { message: 'We could not send your message right now. Please call or email us directly.' })
  }
}
