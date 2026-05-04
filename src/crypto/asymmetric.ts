import type { RSAKeyPairResult, AsymmetricResult } from "@/types";
import forge from "node-forge";

/**
 * Feature 2: RSA Key Generation
 */
export function generateRSAKeyPair(bits: number = 2048): RSAKeyPairResult {
  try {
    const { privateKey, publicKey } = forge.pki.rsa.generateKeyPair(bits);
    return {
      success: true,
      publicKey: forge.pki.publicKeyToPem(publicKey),
      privateKey: forge.pki.privateKeyToPem(privateKey),
    };
  } catch (err) {
    return { success: false, error: "Lỗi khi sinh cặp khóa RSA." };
  }
}

/**
 * Feature 2: RSA Encryption
 */
export function rsaEncrypt(
  plaintext: string,
  publicKeyPem: string,
): AsymmetricResult {
  try {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(plaintext, "RSAES-PKCS1-V1_5");
    return {
      success: true,
      data: forge.util.encode64(encrypted),
    };
  } catch (err) {
    return {
      success: false,
      error: "Mã hóa thất bại. Vui lòng kiểm tra Public Key.",
    };
  }
}

/**
 * Feature 2: RSA Decryption
 */
export function rsaDecrypt(
  ciphertext: string,
  privateKeyPem: string,
): AsymmetricResult {
  try {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedBytes = forge.util.decode64(ciphertext);
    const decrypted = privateKey.decrypt(encryptedBytes, "RSAES-PKCS1-V1_5");
    return {
      success: true,
      data: decrypted,
    };
  } catch (err) {
    return {
      success: false,
      error: "Giải mã thất bại. Vui lòng kiểm tra Private Key.",
    };
  }
}
