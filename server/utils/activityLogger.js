const { ActivityLog } = require('../models');

async function logActivity({
  userId = null,
  action,
  entityType = null,
  entityId = null,
  page = null,
  section = null,
  field = null,
  oldValue = null,
  newValue = null,
  description = null,
  ipAddress = null,
  userAgent = null,
  metadata = null,
}) {
  try {
    const details = {
      page,
      section,
      field,
      oldValue: oldValue ? String(oldValue).substring(0, 5000) : null,
      newValue: newValue ? String(newValue).substring(0, 5000) : null,
      description,
      userAgent,
      metadata,
    };
    Object.keys(details).forEach((k) => {
      if (details[k] === null || details[k] === undefined) delete details[k];
    });

    await ActivityLog.create({
      userId,
      action,
      entityType,
      entityId,
      details: Object.keys(details).length ? details : null,
      ipAddress,
    });
  } catch (error) {
    console.error('Error logging activity:', error.message);
  }
}

function getClientIp(req) {
  return (
    req.ip ||
    req.connection?.remoteAddress ||
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    null
  );
}

function getUserAgent(req) {
  return req.headers['user-agent'] || null;
}

module.exports = {
  logActivity,
  getClientIp,
  getUserAgent,
};
