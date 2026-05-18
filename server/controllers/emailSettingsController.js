const { EmailSettings } = require('../models');
const status = require('../helpers/response');

async function getOrCreateSettings() {
  let settings = await EmailSettings.findByPk(1);
  if (!settings) {
    settings = await EmailSettings.create({
      id: 1,
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: true,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'Modepro',
      contactFormEmail: '',
    });
  }
  return settings;
}

exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const data = settings.toJSON();
    delete data.smtpPassword;
    return status.successResponse(res, 'Retrieved', data);
  } catch (error) {
    console.error('Get Email Settings Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    const body = { ...req.body };
    if (body.smtpSecure === 'ssl' || body.smtpSecure === 'tls') {
      body.smtpSecure = body.smtpSecure === 'ssl' || parseInt(body.smtpPort, 10) === 465;
    }
    if (body.smtpSecure === 'none') body.smtpSecure = false;
    if (!body.smtpPassword || body.smtpPassword === '') {
      delete body.smtpPassword;
    }
    await settings.update(body);
    const data = settings.toJSON();
    delete data.smtpPassword;
    return status.successResponse(res, 'Email settings updated', data);
  } catch (error) {
    console.error('Update Email Settings Error:', error);
    return status.errorResponse(res, error.message);
  }
};

exports.testConnection = async (req, res) => {
  try {
    const { testEmail } = req.body;
    if (!testEmail) {
      return status.errorResponse(res, 'Test email address is required');
    }

    const settings = await getOrCreateSettings();
    if (!settings.smtpHost || !settings.smtpUser) {
      return status.errorResponse(res, 'Email settings not configured');
    }

    const nodemailer = require('nodemailer');
    const port = settings.smtpPort || 587;
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port,
      secure: settings.smtpSecure === true || port === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPassword,
      },
    });

    await transporter.verify();
    await transporter.sendMail({
      from: `"${settings.fromName || 'Modepro'}" <${settings.fromEmail}>`,
      to: testEmail,
      subject: 'Test Email from Modepro CMS',
      html: `<p>SMTP test from Modepro CMS. If you received this, configuration is correct.</p>`,
      text: 'SMTP test from Modepro CMS.',
    });

    return status.successResponse(
      res,
      `Test email sent successfully to ${testEmail}. Please check your inbox.`
    );
  } catch (error) {
    console.error('Test SMTP Connection Error:', error);
    return status.errorResponse(res, error.message || 'SMTP connection failed');
  }
};
