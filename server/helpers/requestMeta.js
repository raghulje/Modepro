function phoneToDigitsOnly(phone) {
  if (phone == null) return '';
  return String(phone).replace(/\D/g, '');
}

function parseUserAgent(ua) {
  if (!ua || typeof ua !== 'string') {
    return { deviceType: 'unknown', browser: 'unknown' };
  }
  const s = ua.toLowerCase();
  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile/i.test(s)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(s)) {
    deviceType = 'tablet';
  }
  let browser = 'unknown';
  if (s.includes('edg/')) browser = 'Edge';
  else if (s.includes('opr/') || s.includes('opera')) browser = 'Opera';
  else if (s.includes('chrome/')) browser = 'Chrome';
  else if (s.includes('safari/') && !s.includes('chrome')) browser = 'Safari';
  else if (s.includes('firefox/')) browser = 'Firefox';
  else if (s.includes('msie') || s.includes('trident/')) browser = 'IE';
  return { deviceType, browser };
}

function getRequestMeta(req) {
  const now = new Date();
  const ua = req.headers['user-agent'] || '';
  const { deviceType, browser } = parseUserAgent(ua);
  const ipAddress =
    req.ip ||
    req.connection?.remoteAddress ||
    (req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',')[0]) ||
    '';
  const referer = req.get('referer') || req.get('referrer') || '';
  const source = (req.body && req.body.source) || referer || '';

  return {
    timestamp: now.getTime(),
    dateTime: now.toISOString(),
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 8),
    ipAddress: (ipAddress && ipAddress.trim()) || '',
    userAgent: ua,
    deviceType,
    browser,
    countryCode: (req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || '')
      .toString()
      .toUpperCase(),
    referer,
    source: typeof source === 'string' ? source : '',
  };
}

module.exports = { getRequestMeta, phoneToDigitsOnly, parseUserAgent };
