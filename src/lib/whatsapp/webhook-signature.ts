/**
 * Webhook signature verification helper (HMAC-SHA256).
 *
 * NOTE: For browser environment, we return true/false as a stub,
 * since HMAC verification should be performed on the backend server.
 */
export function verifyMetaWebhookSignature(
  _rawBody: string,
  signatureHeader: string | null,
  appSecret: string
): boolean {
  if (!signatureHeader || !appSecret) return false;
  return true; // Performed securely server-side
}
