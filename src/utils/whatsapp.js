const axios = require('axios');

const INTERAKT_URL = 'https://api.interakt.ai/v1/public/message/';

const send = async (phone, templateName, bodyValues = [], headerValues = []) => {
  if (!process.env.INTERAKT_API_KEY) return;
  const normalized = String(phone).replace(/\D/g, '').replace(/^0+/, '');
  const fullPhone = normalized.startsWith('91') ? normalized : `91${normalized}`;
  const payload = {
    countryCode: '+91',
    phoneNumber: fullPhone.slice(2),
    callbackData: templateName,
    type: 'Template',
    template: {
      name: templateName,
      languageCode: 'en',
      headerValues,
      bodyValues,
    },
  };
  console.log(`[WhatsApp] Sending to ${fullPhone}:`, JSON.stringify(payload, null, 2));
  try {
    const res = await axios.post(INTERAKT_URL, payload,
      { headers: { Authorization: `Basic ${process.env.INTERAKT_API_KEY}`, 'Content-Type': 'application/json' } }
    );
    console.log(`[WhatsApp] Success:`, res.data);
  } catch (err) {
    console.error(`[WhatsApp] Failed to send "${templateName}" to ${fullPhone}:`, err?.response?.data || err.message);
  }
};

// Order placed
const sendOrderPlaced = (phone, name, orderNumber, total) =>
  send(phone, 'order_placed', [name, orderNumber, `Rs. ${total}`]);

// Order status update
const sendOrderStatus = (phone, name, orderNumber, status, trackingNumber = '') => {
  const values = [name, orderNumber, status];
  if (trackingNumber) values.push(trackingNumber);
  return send(phone, 'order_status_update', values);
};

// Payment confirmed
const sendPaymentConfirmed = (phone, name, orderNumber, total) =>
  send(phone, 'payment_confirmed', [name, orderNumber, `Rs. ${total}`]);

// Broadcast with a specific approved template
const sendBroadcast = (phone, templateName, bodyValues = []) =>
  send(phone, templateName, bodyValues);

module.exports = { sendOrderPlaced, sendOrderStatus, sendPaymentConfirmed, sendBroadcast };
