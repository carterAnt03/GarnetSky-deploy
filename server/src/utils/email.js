const nodemailer = require('nodemailer');

function createTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.warn('Email env vars not configured — emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT || '587', 10),
    secure: EMAIL_PORT === '465',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  const transporter = createTransporter();
  if (!transporter) return;

  const from = process.env.EMAIL_FROM || `GarnetSky <${process.env.EMAIL_USER}>`;

  await transporter.sendMail({
    from,
    to: toEmail,
    subject: 'Reset your GarnetSky password',
    text: `You requested a password reset. Click the link below to set a new password. It expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <p>You requested a password reset for your GarnetSky account.</p>
      <p><a href="${resetUrl}" style="background:#f97316;color:#fff;padding:0.6rem 1.2rem;border-radius:999px;text-decoration:none;font-weight:600;">Reset Password</a></p>
      <p>This link expires in <strong>1 hour</strong>.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
}

module.exports = { sendPasswordResetEmail };
