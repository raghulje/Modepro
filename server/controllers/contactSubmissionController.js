const status = require('../helpers/response');
const { ContactSubmission } = require('../models');
const { getRequestMeta, phoneToDigitsOnly } = require('../helpers/requestMeta');
const { sendToKissflowWebhook } = require('../helpers/kissflowWebhook');
const { sendContactEmails } = require('../helpers/emailService');
const { validateContactSubmission } = require('../helpers/contactFormValidation');

const WEBSITE_NAME = 'Modepro';
const AGENT_ID = process.env.MODEPRO_AGENT_ID || '';

/** Kissflow Product field: single product name (Adonis-style), not tab | group | name. */
function productForKissflow(product) {
  const raw = String(product || '').trim();
  if (!raw || raw === 'General Enquiry') return raw;
  if (raw.includes(' | ')) {
    const parts = raw.split(' | ').map((s) => s.trim());
    return parts[parts.length - 1] || raw;
  }
  return raw;
}

function splitCityAndState(value) {
  const raw = String(value || '').trim();
  if (!raw) {
    return { cityname: '', statename: '' };
  }
  const [cityname = '', ...rest] = raw.split(',');
  return {
    cityname: cityname.trim(),
    statename: rest.join(',').trim(),
  };
}

exports.create = async (req, res) => {
  try {
    const validated = validateContactSubmission(req.body);
    if (!validated.ok) {
      return status.badRequestResponse(res, validated.message);
    }

    const { name, email, mobile, message, city, product } = validated;
    const { source, company } = req.body || {};

    if (!AGENT_ID) {
      console.warn('[Modepro] MODEPRO_AGENT_ID is not set — Kissflow payload will omit agentid');
    }

    const meta = getRequestMeta(req);
    const phoneDigits = phoneToDigitsOnly(mobile);
    const { cityname, statename } = splitCityAndState(city);

    const webhookData = {
      name,
      email,
      Phone_Number: phoneDigits,
      ...(AGENT_ID ? { agentid: AGENT_ID } : {}),
      Product: productForKissflow(product),
      city,
      ...(cityname ? { cityname } : {}),
      ...(statename ? { statename } : {}),
      company: company ?? '',
      message,
      ...(validated.countryDialCode ? { countryDialCode: validated.countryDialCode } : {}),
      ...meta,
    };

    try {
      await ContactSubmission.create({
        name,
        company: company ?? '',
        email,
        mobile,
        city,
        product,
        message,
        source: source || 'contact',
        metadata: meta,
      });
    } catch (dbErr) {
      console.warn('[Modepro] Contact submission DB save failed (non-fatal):', dbErr.message);
    }

    sendToKissflowWebhook(WEBSITE_NAME, 'Contact form', webhookData);

    sendContactEmails({
      name,
      email,
      mobile,
      product,
      message,
      city,
      company: company ?? '',
      source: source || 'contact',
    });

    console.log('[Modepro] Contact submission queued for Kissflow:', {
      submissionId: `${WEBSITE_NAME}-${Date.now()}`,
      name,
      email,
      company: company ?? '',
      product,
      city,
      hasAgentId: Boolean(AGENT_ID),
    });

    return status.createdResponse(res, 'Contact submission received successfully', {
      source: source || 'contact',
    });
  } catch (error) {
    console.error('Create Contact Submission Error:', error);
    return status.createdResponse(res, 'Contact submission received successfully', null);
  }
};
