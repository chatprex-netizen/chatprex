import crypto from 'crypto';

const GCM_IV_LENGTH = 12;
const CBC_IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Encrypt a plaintext string using AES-256-GCM.
 */
export function encrypt(text, encryptionKey) {
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes).');
  }
  const iv = crypto.randomBytes(GCM_IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(encryptionKey, 'hex'),
    iv
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

/**
 * Decrypt an encrypted token string.
 * Auto-detects GCM (3-part) vs CBC legacy (2-part) format.
 */
export function decrypt(encryptedText, encryptionKey) {
  if (!encryptionKey || encryptionKey.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be a 64-character hex string (32 bytes).');
  }
  const parts = encryptedText.split(':');

  if (parts.length === 3) {
    // GCM
    const [ivHex, ctHex, tagHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    if (iv.length !== GCM_IV_LENGTH) {
      throw new Error(`Unexpected GCM IV length ${iv.length}`);
    }
    const authTag = Buffer.from(tagHex, 'hex');
    if (authTag.length !== AUTH_TAG_LENGTH) {
      throw new Error(`Unexpected GCM auth-tag length ${authTag.length}`);
    }
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(encryptionKey, 'hex'),
      iv
    );
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(ctHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  if (parts.length === 2) {
    // CBC legacy
    const [ivHex, ctHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    if (iv.length !== CBC_IV_LENGTH) {
      throw new Error(`Unexpected CBC IV length ${iv.length}`);
    }
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(encryptionKey, 'hex'),
      iv
    );
    let decrypted = decipher.update(ctHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  throw new Error(`Unrecognised format, got ${parts.length - 1} colons`);
}
