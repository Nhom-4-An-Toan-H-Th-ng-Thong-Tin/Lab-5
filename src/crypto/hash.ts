import type { HashAlgorithm, HashResult } from '@/types';
import CryptoJS from 'crypto-js';
/**
 * Computes the hash digest of input text using the specified algorithm.
 * TODO: Implement using crypto-js
 */

export function computeHash(algorithm: HashAlgorithm, text: string): HashResult {
  try {
    if (!text.trim()) {
      return { success: false, error: 'Input text is empty.' };
    }

    if (algorithm === 'MD5') {
      const hash = CryptoJS.MD5(text);
      return {
        success: true,
        digest: hash.toString(CryptoJS.enc.Hex),
      };
    }

    if (algorithm === 'SHA-256') {
      const hash = CryptoJS.SHA256(text);
      return {
        success: true,
        digest: hash.toString(CryptoJS.enc.Hex),
      };
    }

    return {
      success: false,
      error: `Unsupported algorithm: ${algorithm}`,
    };

  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Returns a human-readable description of a hash algorithm.
 */
export function getHashAlgorithmDescription(algorithm: HashAlgorithm): string {
  switch (algorithm) {
    case 'MD5':    return 'MD5 — 128-bit hash, considered unsafe for security purposes.';
    case 'SHA-256': return 'SHA-256 — Part of SHA-2 family, 256-bit hash, widely used in practice.';
  }
}
