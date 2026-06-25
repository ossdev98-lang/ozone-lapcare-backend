const nodemailer = require('nodemailer');

const requiredEmailConfig = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL', 'FROM_NAME'];

const getMissingEmailConfig = () => requiredEmailConfig.filter(key => !process.env[key] || !String(process.env[key]).trim());

const createEmailConfigError = (missing) => {
  const err = new Error(`Missing email configuration: ${missing.join(', ')}`);
  err.statusCode = 503;
  err.publicMessage = `Email service is not configured. Missing: ${missing.join(', ')}.`;
  return err;
};

const createTransporter = () => {
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || smtpPort === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

const getEmailErrorMessage = (err) => {
  if (err.code === 'EAUTH' || err.responseCode === 535) {
    return 'Email service authentication failed. Update SMTP_USER and SMTP_PASS with valid SMTP credentials. For Brevo, use your SMTP login and SMTP key, not your API key.';
  }

  if (err.code === 'EENVELOPE') {
    return 'Email sender or recipient is invalid. Check FROM_EMAIL and make sure it is a verified sender in Brevo.';
  }

  if (err.responseCode) {
    return `Email service rejected the message with SMTP code ${err.responseCode}. Check your Brevo sender, SMTP key, and account status.`;
  }

  return 'Email service is currently unavailable. Please try again later.';
};

const sendEmail = async ({ to, subject, html }) => {
  const missing = getMissingEmailConfig();
  if (missing.length) throw createEmailConfigError(missing);

  try {
    return await createTransporter().sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    err.statusCode = 503;
    err.publicMessage = getEmailErrorMessage(err);
    throw err;
  }
};

const emailTemplates = {
  verifyEmail: (name, otp) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#2875B7,#2BB7B2);padding:30px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0">Ozone Lapcare</h1>
        <p style="color:rgba(255,255,255,0.8)">Your Laptop Care Experts</p>
      </div>
      <div style="background:#f8fafc;padding:30px;border-radius:0 0 12px 12px">
        <h2>Hi ${name},</h2>
        <p>Use this verification code to activate your account.</p>
        <div style="letter-spacing:10px;font-size:34px;font-weight:bold;color:#1f2937;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 22px;text-align:center;margin:24px 0">${otp}</div>
        <p style="color:#64748b;font-size:13px">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    </div>`,
  resetPassword: (name, url) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#2875B7,#2BB7B2);padding:30px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0">Ozone Lapcare</h1>
      </div>
      <div style="background:#f8fafc;padding:30px;border-radius:0 0 12px 12px">
        <h2>Hi ${name},</h2>
        <p>Reset your password by clicking the button below. This link expires in 1 hour.</p>
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#2875B7,#2BB7B2);color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;margin:20px 0">Reset Password</a>
      </div>
    </div>`,
  orderConfirmation: (name, orderNumber, total) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#2875B7,#2BB7B2);padding:30px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0">Order Confirmed!</h1>
      </div>
      <div style="background:#f8fafc;padding:30px;border-radius:0 0 12px 12px">
        <h2>Hi ${name},</h2>
        <p>Your order <strong>#${orderNumber}</strong> has been confirmed.</p>
        <p>Total Amount: <strong>Rs. ${total}</strong></p>
        <p>Thank you for shopping with Ozone Lapcare!</p>
      </div>
    </div>`,
};

module.exports = { sendEmail, emailTemplates };
