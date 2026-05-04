import type { RSAKeyPairResult, AsymmetricResult } from '@/types';
import forge from 'node-forge';

/**
 * Generates an RSA key pair (public key and private key).
 * Sử dụng node-forge để sinh khóa.
 */
export function generateRSAKeyPair(bits: number = 2048): RSAKeyPairResult {
  try {
    // Sinh cặp khóa RSA đồng bộ (chú ý: nếu bits = 4096 có thể mất vài giây)
    const keypair = forge.pki.rsa.generateKeyPair({ bits, e: 0x10001 });
    
    // Chuyển đổi khóa sang định dạng chuẩn PEM để dễ hiển thị và lưu trữ
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

    return { 
      success: true, 
      keyPair: { 
        publicKey: publicKeyPem, 
        privateKey: privateKeyPem 
      } 
    };
  } catch (err) {
    return { success: false, error: `Lỗi khi sinh khóa RSA: ${String(err)}` };
  }
}

/**
 * Encrypts plaintext using an RSA public key.
 */
export function rsaEncrypt(plaintext: string, publicKeyPem: string): AsymmetricResult {
  try {
    if (!plaintext.trim()) {
      return { success: false, error: 'Vui lòng nhập văn bản cần mã hóa (Plaintext).' };
    }
    if (!publicKeyPem.trim()) {
      return { success: false, error: 'Public Key không được để trống.' };
    }

    // 1. Phân tích Public Key từ chuỗi PEM
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    
    // 2. Chuyển string sang chuỗi byte UTF-8 (để không bị lỗi khi mã hóa tiếng Việt)
    const bytes = forge.util.encodeUtf8(plaintext);
    
    // 3. Mã hóa bằng chuẩn RSA-OAEP (an toàn và hiện đại hơn PKCS#1 v1.5)
    const encrypted = publicKey.encrypt(bytes, 'RSA-OAEP');
    
    // 4. Mã hóa chuỗi byte kết quả thành Base64 để hiển thị dưới dạng Text
    const base64Ciphertext = forge.util.encode64(encrypted);

    return { success: true, data: base64Ciphertext };
  } catch (err) {
    return { success: false, error: 'Lỗi mã hóa: Vui lòng kiểm tra lại tính hợp lệ của Public Key.' };
  }
}

/**
 * Decrypts ciphertext using an RSA private key.
 */
export function rsaDecrypt(ciphertext: string, privateKeyPem: string): AsymmetricResult {
  try {
    if (!ciphertext.trim()) {
      return { success: false, error: 'Vui lòng nhập văn bản cần giải mã (Ciphertext).' };
    }
    if (!privateKeyPem.trim()) {
      return { success: false, error: 'Private Key không được để trống.' };
    }

    // 1. Phân tích Private Key từ chuỗi PEM
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    
    // 2. Giải mã chuỗi Base64 đầu vào thành dạng byte
    const decoded64 = forge.util.decode64(ciphertext);
    
    // 3. Thực hiện giải mã RSA-OAEP
    const decryptedBytes = privateKey.decrypt(decoded64, 'RSA-OAEP');
    
    // 4. Chuyển đổi lại từ byte UTF-8 sang chuỗi String bình thường
    const plaintext = forge.util.decodeUtf8(decryptedBytes);

    return { success: true, data: plaintext };
  } catch (err) {
    return { success: false, error: 'Lỗi giải mã: Khóa Private Key không khớp hoặc Ciphertext bị hỏng.' };
  }
}