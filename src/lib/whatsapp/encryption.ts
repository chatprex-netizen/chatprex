/**
 * Encryption stub for the browser.
 * Active AES-256-GCM encryption is performed server-side for safety.
 */
export function encrypt(_text: string, _encryptionKey: string): string {
  throw new Error('Encryption must be performed on the backend to avoid exposing keys.');
}

export function decrypt(_encryptedText: string, _encryptionKey: string): string {
  throw new Error('Decryption must be performed on the backend to avoid exposing keys.');
}

export function isLegacyFormat(encryptedText: string): boolean {
  return encryptedText.split(':').length === 2;
}
