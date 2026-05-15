const https = require('https');
const { URL } = require('url');

const KISSFLOW_WEBHOOK_URL =
  'https://refexgroup.kissflow.com/integration/2/AcCMptlq60zH/webhook/F51DqkQt8HoYqlSALpUWU8-uPOXxdSINKjZmtzXphM6Ujk-hJLw6lgZBW8NrIyyvXSmmZS9MwwaWdTmahBLNxQ';

const queue = [];
let workerRunning = false;
const DELAY_MS_MIN = 3000;
const DELAY_MS_MAX = 4000;

function randomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function slugFromWebsiteName(websiteName) {
  if (!websiteName || typeof websiteName !== 'string') return 'website';
  return websiteName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9-]/g, '');
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processOne(websiteName, formName, formData) {
  const websiteSlug = slugFromWebsiteName(websiteName);
  const submissionId = `${websiteSlug}-${Date.now()}-${randomString(8)}`;
  const websiteAndForm = `${websiteName} - ${formName}`;
  const payload = {
    ...formData,
    submissionId,
    websiteName,
    formName,
    Website_and_form: websiteAndForm,
  };

  try {
    const body = JSON.stringify(payload);
    const url = new URL(KISSFLOW_WEBHOOK_URL);
    const res = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: url.hostname,
          port: url.port || 443,
          path: url.pathname + url.search,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(body, 'utf8'),
          },
        },
        (response) => {
          let data = '';
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => resolve({ status: response.statusCode, data }));
        }
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
    if (res.status < 200 || res.status >= 300) {
      console.warn('[Kissflow] Webhook responded with status:', res.status, res.data);
    } else {
      console.log('[Kissflow] Webhook delivered:', submissionId, 'status', res.status);
    }
  } catch (err) {
    console.warn('[Kissflow] Webhook request failed (non-fatal):', err.message);
  }
}

async function worker() {
  if (workerRunning || queue.length === 0) return;
  workerRunning = true;
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) continue;
    await processOne(item.websiteName, item.formName, item.formData);
    const delayMs = DELAY_MS_MIN + Math.random() * (DELAY_MS_MAX - DELAY_MS_MIN);
    await delay(delayMs);
  }
  workerRunning = false;
}

function sendToKissflowWebhook(websiteName, formName, formData) {
  queue.push({
    websiteName: websiteName || 'Modepro',
    formName: formName || 'Contact form',
    formData: formData || {},
  });
  worker().catch((err) => {
    console.warn('[Kissflow] Worker error (non-fatal):', err.message);
  });
}

module.exports = { sendToKissflowWebhook };
