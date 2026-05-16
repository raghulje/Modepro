const nodemailer = require('nodemailer');

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.zoho.in';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure =
    process.env.SMTP_SECURE === 'true' ||
    process.env.SMTP_SECURE === '1' ||
    port === 465;

  return {
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '',
    },
    fromEmail: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || '',
    fromName: process.env.SMTP_FROM_NAME || 'Modepro India',
    contactFormEmail:
      process.env.CONTACT_FORM_EMAIL || 'info@modepro.com',
  };
}

function isEmailConfigured() {
  const { auth, fromEmail } = getSmtpConfig();
  return Boolean(auth.user && auth.pass && fromEmail);
}

function createTransporter() {
  const { host, port, secure, auth } = getSmtpConfig();
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: auth.user ? auth : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
}

async function sendEmail({ to, subject, html, text }) {
  if (!isEmailConfigured()) {
    console.warn('[Modepro] SMTP not configured — skipping email');
    return false;
  }

  const { fromEmail, fromName } = getSmtpConfig();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    html,
    text,
  });

  return true;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildAutoReply({ name, email, phone, product, message, city, company }) {
  const safeName = escapeHtml(name || 'there');
  const safeProduct = escapeHtml(product || '');
  const safeEmail = escapeHtml(email || '');
  const safePhone = escapeHtml(phone || '');
  const safeCity = escapeHtml(city || '');
  const safeCompany = escapeHtml(company || '');
  const safeMessage = escapeHtml(message || '');

  const subject = 'We received your enquiry - Modepro India';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111827;">
      <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #1e3a5f;">Thanks for reaching out</h2>
      <p style="margin: 0 0 12px 0; line-height: 1.6;">Hi ${safeName},</p>
      <p style="margin: 0 0 12px 0; line-height: 1.6;">
        We've received your enquiry and our team will get back to you shortly.
      </p>
      <div style="margin-top: 12px; padding: 14px 16px; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px;">
        <p style="margin: 0 0 6px 0; line-height: 1.6;"><strong>Name:</strong> ${safeName}</p>
        ${safeCompany ? `<p style="margin: 0 0 6px 0; line-height: 1.6;"><strong>Company:</strong> ${safeCompany}</p>` : ''}
        ${safeEmail ? `<p style="margin: 0 0 6px 0; line-height: 1.6;"><strong>Email:</strong> ${safeEmail}</p>` : ''}
        ${safePhone ? `<p style="margin: 0 0 6px 0; line-height: 1.6;"><strong>Contact:</strong> ${safePhone}</p>` : ''}
        ${safeCity ? `<p style="margin: 0 0 6px 0; line-height: 1.6;"><strong>City:</strong> ${safeCity}</p>` : ''}
        ${safeProduct ? `<p style="margin: 0 0 6px 0; line-height: 1.6;"><strong>Product:</strong> ${safeProduct}</p>` : ''}
        ${safeMessage ? `<p style="margin: 0; line-height: 1.6; white-space: pre-wrap;"><strong>Message:</strong><br/>${safeMessage}</p>` : ''}
      </div>
      <p style="margin: 18px 0 0 0; font-size: 12px; color: #6B7280; line-height: 1.6;">
        Regards,<br/>Modepro India Pvt. Ltd.
      </p>
    </div>
  `;

  const text = `Hi ${name || 'there'},\n\nWe've received your enquiry and our team will get back to you shortly.\n\nYour enquiry details:\n${name ? `- Name: ${name}\n` : ''}${company ? `- Company: ${company}\n` : ''}${email ? `- Email: ${email}\n` : ''}${phone ? `- Contact: ${phone}\n` : ''}${city ? `- City: ${city}\n` : ''}${product ? `- Product: ${product}\n` : ''}${message ? `- Message: ${message}\n` : ''}\nRegards,\nModepro India Pvt. Ltd.`;

  return { subject, html, text };
}

function buildStaffNotification({ name, email, mobile, product, message, city, company, source }) {
  const safe = escapeHtml;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 10px;">New Contact Form Submission</h2>
      <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>Name:</strong> ${safe(name)}</p>
        ${company ? `<p><strong>Company:</strong> ${safe(company)}</p>` : ''}
        <p><strong>Email:</strong> ${safe(email)}</p>
        <p><strong>Mobile:</strong> ${safe(mobile)}</p>
        ${product ? `<p><strong>Product:</strong> ${safe(product)}</p>` : ''}
        ${city ? `<p><strong>City:</strong> ${safe(city)}</p>` : ''}
        <p><strong>Message:</strong><br/>${safe(message).replace(/\n/g, '<br>')}</p>
        <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 12px;">
          <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
          <strong>Source:</strong> ${safe(source || 'contact')}
        </p>
      </div>
    </div>
  `;

  const text = `New Contact Form Submission\n\nName: ${name}\n${company ? `Company: ${company}\n` : ''}Email: ${email}\nMobile: ${mobile}\n${product ? `Product: ${product}\n` : ''}${city ? `City: ${city}\n` : ''}Message: ${message}\n\nSubmitted: ${new Date().toLocaleString()}\nSource: ${source || 'contact'}`;

  return {
    subject: 'New Contact Form Submission - Modepro India',
    html,
    text,
  };
}

function sendContactEmails(payload) {
  if (!isEmailConfigured()) return;

  const { contactFormEmail } = getSmtpConfig();
  const { name, email, mobile, product, message, city, company, source } = payload;

  setImmediate(async () => {
    try {
      const staff = buildStaffNotification({
        name,
        email,
        mobile,
        product,
        message,
        city,
        company,
        source,
      });
      await sendEmail({
        to: contactFormEmail,
        subject: staff.subject,
        html: staff.html,
        text: staff.text,
      });
    } catch (err) {
      console.error('[Modepro] Staff notification email failed:', err?.message || err);
    }

    if (!email) return;

    try {
      const reply = buildAutoReply({
        name,
        email,
        phone: mobile,
        product,
        message,
        city,
        company,
      });
      await sendEmail({
        to: email,
        subject: reply.subject,
        html: reply.html,
        text: reply.text,
      });
    } catch (err) {
      console.warn('[Modepro] Auto-reply email failed:', err?.message || err);
    }
  });
}

module.exports = {
  getSmtpConfig,
  isEmailConfigured,
  sendEmail,
  sendContactEmails,
};
