/**
 * Sanitize phone number for Meta WhatsApp API.
 * e.g. "+370 63949836" → "37063949836"
 */
export function sanitizePhoneForMeta(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Normalize phone number by removing all non-digit characters.
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Compare two phone numbers.
 */
export function phonesMatch(phone1, phone2) {
  const n1 = normalizePhone(phone1);
  const n2 = normalizePhone(phone2);
  if (n1 === n2) return true;
  if (n1.length >= 8 && n2.length >= 8) {
    return n1.slice(-8) === n2.slice(-8);
  }
  return false;
}

/**
 * Validate phone number format.
 */
export function isValidE164(phone) {
  return /^\+?[1-9]\d{6,14}$/.test(phone);
}

/**
 * Generate plausible phone number variants for retry.
 */
export function phoneVariants(sanitized) {
  if (!sanitized) return [];
  const seen = new Set();
  const push = (v) => {
    if (v && !seen.has(v)) seen.add(v);
  };

  push(sanitized);

  for (const ccLen of [1, 2, 3]) {
    if (sanitized.length <= ccLen) continue;
    const cc = sanitized.slice(0, ccLen);
    const rest = sanitized.slice(ccLen);
    if (!rest.startsWith('0')) {
      push(cc + '0' + rest);
    }
  }

  for (const ccLen of [1, 2, 3]) {
    if (sanitized.length <= ccLen + 1) continue;
    const cc = sanitized.slice(0, ccLen);
    const rest = sanitized.slice(ccLen);
    if (rest.startsWith('0')) {
      push(cc + rest.slice(1));
    }
  }

  return [...seen];
}

/**
 * Returns true when the Meta API error indicates sandbox restriction.
 */
export function isRecipientNotAllowedError(message) {
  return /131030|not in allowed list|not in the allowed list/i.test(message);
}
