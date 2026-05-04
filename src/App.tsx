import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer, MainMenu } from '@/components/layout';
import { SymmetricPage, AsymmetricPage, HashPage } from '@/pages';
import { symmetricEncrypt, symmetricDecrypt, generateSymmetricKey } from '@/crypto/symmetric';
import { computeHash } from './crypto/hash';

import { generateRSAKeyPair, rsaEncrypt, rsaDecrypt } from '@/crypto/asymmetric';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            
            <Route
              path="/symmetric"
              element={
                <SymmetricPage
                  onEncrypt={(algo, mode, pt, key) => {
                    const result = symmetricEncrypt(algo, pt, key, mode);
                    if (!result.success) throw new Error(result.error);
                    return result.data!;
                  }}
                  onDecrypt={(algo, mode, ct, key) => {
                    const result = symmetricDecrypt(algo, ct, key, mode);
                    if (!result.success) throw new Error(result.error);
                    return result.data!;
                  }}
                  onGenerateKey={(algo) => generateSymmetricKey({ algorithm: algo })}
                />
              }
            />
            
            <Route
              path="/asymmetric"
              element={
                <AsymmetricPage
                  onGenerateKeyPair={(bits) => {
                    console.log('[App] generate RSA key pair', bits, 'bits');
                    // Gọi hàm sinh khóa RSA thực tế
                    const result = generateRSAKeyPair(bits);
                    if (!result.success || !result.keyPair) {
                      throw new Error(result.error || 'Lỗi khi tạo cặp khóa RSA');
                    }
                    return result.keyPair;
                  }}
                  onEncrypt={(pt, pubKey) => {
                    console.log('[App] RSA encrypt with pubKey length', pubKey.length);
                    // Gọi hàm mã hóa RSA thực tế
                    const result = rsaEncrypt(pt, pubKey);
                    if (!result.success) throw new Error(result.error);
                    return result.data!;
                  }}
                  onDecrypt={(ct, privKey) => {
                    console.log('[App] RSA decrypt with privKey length', privKey.length);
                    // Gọi hàm giải mã RSA thực tế
                    const result = rsaDecrypt(ct, privKey);
                    if (!result.success) throw new Error(result.error);
                    return result.data!;
                  }}
                />
              }
            />
            
            <Route
              path="/hash"
              element={
                <HashPage
                    onComputeHash={(algo, text) => {
                        console.log('[App] compute', algo, 'hash of', text);
                        const result = computeHash(algo, text);
                        if (!result.success) throw new Error(result.error);
                        return result.digest!;
                    }}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}