import type { HashAlgorithm, HashResult } from '@/types';

/**
 * Computes the hash digest of input text using the specified algorithm.
 * TODO: Implement using crypto-js
 */
export function computeHash(algorithm: HashAlgorithm, text: string): HashResult {
  try {
    // TODO: Implement MD5 and SHA-256 hashing
    // crypto-js usage:
    //   MD5:    CryptoJS.algo.MD5.create().finalize(text)
    //   SHA-256: CryptoJS.algo.SHA256.create().finalize(text)
    console.log(`[computeHash] ${algorithm} on "${text}"`);
    return { success: false, digest: undefined, error: 'Hash computation not yet implemented.' };
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
