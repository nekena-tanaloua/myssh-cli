import crypto from 'crypto';
import { CONFIG } from '../config.js';

export class Encryption {
  static async deriveKey(masterPassword, existingSalt = null) {
    const salt = existingSalt
      ? Buffer.from(existingSalt, 'hex')
      : crypto.randomBytes(16);

    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        masterPassword,
        salt,
        CONFIG.pbkdf2Iterations,
        CONFIG.pbkdf2KeyLen,
        CONFIG.pbkdf2Digest,
        (err, key) => {
          if (err) reject(err);
          resolve({ key, salt });
        }
      );
    });
  }

  static async encrypt(data, masterPassword) {
    const { key, salt } = await this.deriveKey(masterPassword);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(CONFIG.algorithm, key, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      salt: salt.toString('hex'),
    };
  }

  static async decrypt(encryptedData, masterPassword) {
    const { encrypted, iv, authTag, salt } = encryptedData;
    const { key } = await this.deriveKey(masterPassword, salt);

    const decipher = crypto.createDecipheriv(
      CONFIG.algorithm,
      key,
      Buffer.from(iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }
}
