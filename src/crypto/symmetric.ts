import CryptoJS from 'crypto-js';
import type {
  SymmetricAlgorithm,
  SymmetricMode,
  SymmetricResult,
  KeyGenerationOptions,
} from '@/types';

/**
 * Parses a key into a WordArray. Auto-detects hex vs UTF-8 format.
 * Generated keys are hex-encoded; manual keys may be UTF-8 text.
 */
function parseKey(key: string): CryptoJS.lib.WordArray {
  if (/^[0-9a-fA-F]+$/.test(key) && key.length % 2 === 0) {
    return CryptoJS.enc.Hex.parse(key);
  }
  return CryptoJS.enc.Utf8.parse(key);
}

/**
 * Encrypts plaintext using the specified symmetric algorithm.
 */
export function symmetricEncrypt(
  algorithm: SymmetricAlgorithm,
  plaintext: string,
  key: string,
  mode: SymmetricMode = 'CBC'
): SymmetricResult {
  try {
    if (!plaintext.trim()) {
      return { success: false, error: 'Plaintext is empty.' };
    }
    if (!key.trim()) {
      return { success: false, error: 'Key is empty.' };
    }

    const keyBytes = parseKey(key).sigBytes;
    const expected = getExpectedKeySize(algorithm);
    if (keyBytes !== expected) {
      return {
        success: false,
        error: `Invalid key length for ${algorithm}: expected ${expected} bytes, got ${keyBytes} bytes.`
      };
    }

    const keyWordArray = parseKey(key);
    const cryptoMode = mode === 'CBC' ? CryptoJS.mode.CBC : CryptoJS.mode.ECB;

    if (algorithm === 'AES') {
      // TODO: Implement AES encryption
      return { success: false, error: 'AES encryption not yet implemented.' };
    }

    if (algorithm === 'DES') {
      const iv = mode === 'CBC' ? CryptoJS.lib.WordArray.random(8) : undefined;
      const encrypted = CryptoJS.DES.encrypt(plaintext, keyWordArray, {
        iv,
        mode: cryptoMode,
        padding: CryptoJS.pad.Pkcs7,
      });
      if (mode === 'CBC' && iv) {
        return { success: true, data: iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Hex) };
      }
      return { success: true, data: encrypted.ciphertext.toString(CryptoJS.enc.Hex) };
    }

    if (algorithm === '3DES') {
      const iv = mode === 'CBC' ? CryptoJS.lib.WordArray.random(8) : undefined;
      const encrypted = CryptoJS.TripleDES.encrypt(plaintext, keyWordArray, {
        iv,
        mode: cryptoMode,
        padding: CryptoJS.pad.Pkcs7,
      });
      if (mode === 'CBC' && iv) {
        return { success: true, data: iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Hex) };
      }
      return { success: true, data: encrypted.ciphertext.toString(CryptoJS.enc.Hex) };
    }

    return { success: false, error: `Unsupported algorithm: ${algorithm}` };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Decrypts ciphertext using the specified symmetric algorithm.
 */
export function symmetricDecrypt(
  algorithm: SymmetricAlgorithm,
  ciphertext: string,
  key: string,
  mode: SymmetricMode = 'CBC'
): SymmetricResult {
  try {
    if (!ciphertext.trim()) {
      return { success: false, error: 'Ciphertext is empty.' };
    }
    if (!key.trim()) {
      return { success: false, error: 'Key is empty.' };
    }

    const keyBytes = parseKey(key).sigBytes;
    const expected = getExpectedKeySize(algorithm);
    if (keyBytes !== expected) {
      return {
        success: false,
        error: `Invalid key length for ${algorithm}: expected ${expected} bytes, got ${keyBytes} bytes.`
      };
    }

    const keyWordArray = parseKey(key);
    const cryptoMode = mode === 'CBC' ? CryptoJS.mode.CBC : CryptoJS.mode.ECB;
    let iv: CryptoJS.lib.WordArray | undefined;
    let rawCiphertext: string;

    if (mode === 'CBC') {
      if (ciphertext.length < 16) {
        return { success: false, error: 'Ciphertext is too short. Missing IV or invalid format.' };
      }
      iv = CryptoJS.enc.Hex.parse(ciphertext.substring(0, 16));
      rawCiphertext = ciphertext.substring(16);
    } else {
      rawCiphertext = ciphertext;
    }

    const ciphertextWordArray = CryptoJS.enc.Hex.parse(rawCiphertext);

    if (algorithm === 'AES') {
      // TODO: Implement AES decryption
      return { success: false, error: 'AES decryption not yet implemented.' };
    }

    if (algorithm === 'DES') {
      const decrypted = CryptoJS.DES.decrypt(
        { ciphertext: ciphertextWordArray } as CryptoJS.lib.CipherParams,
        keyWordArray,
        {
          iv,
          mode: cryptoMode,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      if (!plaintext) {
        return { success: false, error: 'Decryption failed. Wrong key or corrupted ciphertext.' };
      }
      return { success: true, data: plaintext };
    }

    if (algorithm === '3DES') {
      const decrypted = CryptoJS.TripleDES.decrypt(
        { ciphertext: ciphertextWordArray } as CryptoJS.lib.CipherParams,
        keyWordArray,
        {
          iv,
          mode: cryptoMode,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      if (!plaintext) {
        return { success: false, error: 'Decryption failed. Wrong key or corrupted ciphertext.' };
      }
      return { success: true, data: plaintext };
    }

    return { success: false, error: `Unsupported algorithm: ${algorithm}` };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Generates a random key for the specified symmetric algorithm.
 */
export function generateSymmetricKey(options: KeyGenerationOptions): string {
  const { algorithm } = options;
  let byteCount: number;

  switch (algorithm) {
    case 'DES':
      byteCount = 8;
      break;
    case '3DES':
      byteCount = 24;
      break;
    case 'AES':
      byteCount = 16;
      break;
    default:
      byteCount = 16;
  }

  const randomBytes = CryptoJS.lib.WordArray.random(byteCount);
  return randomBytes.toString(CryptoJS.enc.Hex);
}

/**
 * Validates that a key matches the expected length for an algorithm.
 */
export function validateSymmetricKey(algorithm: SymmetricAlgorithm, key: string): boolean {
  const keyBytes = new TextEncoder().encode(key);
  const len = keyBytes.length;
  switch (algorithm) {
    case 'DES':   return len === 8;
    case '3DES':  return len === 24 || len === 16;
    case 'AES':   return len === 16 || len === 24 || len === 32;
    default:      return false;
  }
}

/**
 * Returns the expected key size in bytes for a given algorithm.
 */
export function getExpectedKeySize(algorithm: SymmetricAlgorithm): number {
  switch (algorithm) {
    case 'DES':   return 8;
    case '3DES':  return 24;
    case 'AES':   return 16;
  }
}
