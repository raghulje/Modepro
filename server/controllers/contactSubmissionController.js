const status = require('../helpers/response');
const { getRequestMeta, phoneToDigitsOnly } = require('../helpers/requestMeta');
const { sendToKissflowWebhook } = require('../helpers/kissflowWebhook');
const { sendContactEmails } = require('../helpers/emailService');
const { validateContactSubmission } = require('../helpers/contactFormValidation');

const WEBSITE_NAME = 'Modepro';
const AGENT_ID = process.env.MODEPRO_AGENT_ID || '';

/** Kissflow Product field: single product name, not tab | group | name. */
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

/** Kissflow inquiry label (3iMedtech-style keys; Modepro has no inquiry field on form). */
function inquiryFromProduct(product) {
  const p = productForKissflow(product);
  if (!p || p === 'General Enquiry') return 'General Information Request';
  return 'Product Enquiry';
}

/** Payload keys and order aligned with Refex/Kissflow contact webhook spec. */
function buildKissflowPayload(fields, meta) {
  return {
    name: fields.name,
    email: fields.email,
    Phone_Number: fields.phoneDigits,
    agentid: AGENT_ID,
    company: fields.company ?? '',
    city: fields.city,
    cityname: fields.cityname ?? '',
    statename: fields.statename ?? '',
    Product: productForKissflow(fields.product),
    message: fields.message,
    companySize: fields.companySize ?? '',
    inquiry: fields.inquiry ?? inquiryFromProduct(fields.product),
    timestamp: meta.timestamp,
    dateTime: meta.dateTime,
    date: meta.date,
    time: meta.time,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    deviceType: meta.deviceType,
    browser: meta.browser,
    countryCode: meta.countryCode,
    referer: meta.referer,
    source: meta.source,
  };
}

exports.create = async (req, res) => {
  try {
    const validated = validateContactSubmission(req.body);
    if (!validated.ok) {
      return status.badRequestResponse(res, validated.message);
    }

    const { name, email, mobile, message, city, product } = validated;
    const { company, companySize, inquiry } = req.body || {};

    if (!AGENT_ID) {
      console.warn('[Modepro] MODEPRO_AGENT_ID is not set — Kissflow payload will omit agentid');
    }

    const meta = getRequestMeta(req);
    const phoneDigits = phoneToDigitsOnly(mobile);
    const { cityname, statename } = splitCityAndState(city);

    const webhookData = buildKissflowPayload(
      {
        name,
        email,
        phoneDigits,
        company,
        city,
        cityname,
        statename,
        product,
        message,
        companySize,
        inquiry,
      },
      meta
    );

    if (!AGENT_ID) {
      delete webhookData.agentid;
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
      source: meta.source || 'contact',
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
      source: meta.source || 'contact',
    });
  } catch (error) {
    console.error('Create Contact Submission Error:', error);
    return status.createdResponse(res, 'Contact submission received successfully', null);
  }
};
