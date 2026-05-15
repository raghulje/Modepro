const { phoneToDigitsOnly } = require('./requestMeta');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normalizeDialCode(dial) {
  let d = String(dial || '').trim();
  if (!d) return '+91';
  if (!d.startsWith('+')) d = `+${d.replace(/\D/g, '')}`;
  return d;
}

function buildInternationalMobile(countryDialCode, mobileLocal) {
  const dial = normalizeDialCode(countryDialCode);
  const localDigits = String(mobileLocal || '').replace(/\D/g, '');
  return `${dial}${localDigits}`;
}

function resolveMobile(body) {
  const dial = body.countryDialCode;
  const local = body.mobileLocal;
  if (dial != null && String(dial).trim() && local != null && String(local).trim()) {
    return buildInternationalMobile(dial, local);
  }
  if (body.mobile != null && String(body.mobile).trim()) {
    return String(body.mobile).trim();
  }
  return '';
}

function validateContactSubmission(body) {
  const raw = body || {};
  const name = String(raw.name || '').trim();
  const email = String(raw.email || '').trim();
  const message = String(raw.message || '').trim();
  const mobile = resolveMobile(raw);
  const city = String(raw.city || '').trim();
  const product = String(raw.product || '').trim();

  if (name.length < 2) {
    return { ok: false, message: 'Name must be at least 2 characters' };
  }
  if (!email) {
    return { ok: false, message: 'Email is required' };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: 'Enter a valid email address' };
  }
  if (!mobile) {
    return { ok: false, message: 'Mobile number is required' };
  }
  const digits = phoneToDigitsOnly(mobile);
  const dialNorm = normalizeDialCode(raw.countryDialCode || '');
  const localDigits = String(raw.mobileLocal || '').replace(/\D/g, '');
  const isIndia =
    dialNorm === '+91' || (digits.startsWith('91') && digits.length === 12);
  if (isIndia) {
    const local = localDigits || (digits.startsWith('91') ? digits.slice(2) : '');
    if (local.length !== 10) {
      return { ok: false, message: 'Indian mobile numbers must be exactly 10 digits' };
    }
  } else if (digits.length < 8 || digits.length > 15) {
    return {
      ok: false,
      message: 'Enter a valid mobile number (8–15 digits total with country code)',
    };
  }
  if (!city) {
    return { ok: false, message: 'City is required' };
  }
  if (!product) {
    return { ok: false, message: 'Product is required' };
  }
  if (!message) {
    return { ok: false, message: 'Message is required' };
  }
  if (message.length < 15) {
    return { ok: false, message: 'Message must be at least 15 characters' };
  }

  const countryDialCode =
    raw.countryDialCode != null ? String(raw.countryDialCode).trim() : '';
  return {
    ok: true,
    name,
    email,
    mobile,
    message,
    city,
    product,
    ...(countryDialCode ? { countryDialCode } : {}),
  };
}

module.exports = { validateContactSubmission, resolveMobile };
