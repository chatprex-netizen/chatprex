const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

async function throwMetaError(response, fallback) {
  let message = fallback;
  try {
    const data = await response.json();
    if (data.error?.message) message = data.error.message;
  } catch {
    // Keep fallback
  }
  throw new Error(message);
}

/**
 * Verify a Meta phone number ID.
 */
export async function verifyPhoneNumber({ phoneNumberId, accessToken }) {
  const url = `${META_API_BASE}/${phoneNumberId}?fields=id,display_phone_number,verified_name,quality_rating`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`);
  }
  return response.json();
}

/**
 * Register phone number for webhooks.
 */
export async function registerPhoneNumber({ phoneNumberId, accessToken, pin }) {
  const url = `${META_API_BASE}/${phoneNumberId}/register`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', pin }),
  });

  if (response.ok) {
    return { success: true, alreadyRegistered: false };
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    // Keep empty
  }
  const message = data.error?.message ?? `Meta API error: ${response.status}`;
  if (/already.*registered/i.test(message)) {
    return { success: true, alreadyRegistered: true };
  }
  throw new Error(message);
}

/**
 * Subscribe WABA to the App.
 */
export async function subscribeWabaToApp({ wabaId, accessToken }) {
  const url = `${META_API_BASE}/${wabaId}/subscribed_apps`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`);
  }
}

/**
 * Send a free-form WhatsApp text message.
 */
export async function sendTextMessage({ phoneNumberId, accessToken, to, text, contextMessageId }) {
  const url = `${META_API_BASE}/${phoneNumberId}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: { body: text },
  };
  if (contextMessageId) {
    body.context = { message_id: contextMessageId };
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`);
  }
  const data = await response.json();
  return { messageId: data.messages[0].id };
}

/**
 * Send media message (image, video, document, audio).
 */
export async function sendMediaMessage({ phoneNumberId, accessToken, to, kind, link, caption, filename, contextMessageId }) {
  const url = `${META_API_BASE}/${phoneNumberId}/messages`;
  const media = { link };
  if (caption && kind !== 'audio') media.caption = caption;
  if (kind === 'document' && filename) media.filename = filename;

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: kind,
    [kind]: media,
  };
  if (contextMessageId) body.context = { message_id: contextMessageId };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`);
  }
  const data = await response.json();
  return { messageId: data.messages[0].id };
}

/**
 * Send template message.
 */
export async function sendTemplateMessage({ phoneNumberId, accessToken, to, templateName, language = 'en_US', params, contextMessageId }) {
  const url = `${META_API_BASE}/${phoneNumberId}/messages`;
  const templatePayload = {
    name: templateName,
    language: { code: language },
  };

  if (params && params.length > 0) {
    templatePayload.components = [
      {
        type: 'body',
        parameters: params.map((p) => ({ type: 'text', text: String(p) })),
      },
    ];
  }

  const body = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: templatePayload,
  };
  if (contextMessageId) {
    body.context = { message_id: contextMessageId };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    await throwMetaError(response, `Meta API error: ${response.status}`);
  }
  const data = await response.json();
  return { messageId: data.messages[0].id };
}

/**
 * Fetch Meta media CDN URL and MIME type.
 */
export async function getMediaUrl({ mediaId, accessToken }) {
  const response = await fetch(`${META_API_BASE}/${mediaId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    await throwMetaError(response, `Media fetch failed: ${response.status}`);
  }
  const data = await response.json();
  if (!data.url) throw new Error('Media URL not found in Meta response');
  return { url: data.url, mimeType: data.mime_type || 'application/octet-stream' };
}

/**
 * Download binary bytes for a media URL.
 */
export async function downloadMedia({ downloadUrl, accessToken }) {
  const response = await fetch(downloadUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`Media download failed: ${response.status}`);
  }
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, contentType };
}
