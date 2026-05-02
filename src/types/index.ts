export type SymmetricAlgorithm = 'DES' | '3DES' | 'AES';
export type SymmetricMode = 'CBC' | 'ECB';
export type AsymmetricAlgorithm = 'RSA';
export type HashAlgorithm = 'MD5' | 'SHA-256';

export interface SymmetricResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface RSAKeyPairResult {
  success: boolean;
  keyPair?: RSAKeyPair;
  error?: string;
}

export interface AsymmetricResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface HashResult {
  success: boolean;
  digest?: string;
  error?: string;
}

export interface KeyGenerationOptions {
  algorithm: SymmetricAlgorithm;
  keySize?: number;
}

export interface CopyStatus {
  copied: boolean;
  message: string;
}
