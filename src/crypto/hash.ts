import CryptoJS from 'crypto-js';
import type { HashAlgorithm, HashResult } from '@/types';

export function computeHash(algorithm: HashAlgorithm, text: string): HashResult {
  try {
    if (algorithm === 'SHA-256') {
      const digest = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
      return { success: true, digest };
    }

    return { success: false, error: 'Hash computation not yet implemented.' };
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
