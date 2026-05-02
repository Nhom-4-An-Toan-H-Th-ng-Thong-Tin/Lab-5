import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer, MainMenu } from '@/components/layout';
import { SymmetricPage, AsymmetricPage, HashPage } from '@/pages';
import { symmetricEncrypt, symmetricDecrypt, generateSymmetricKey } from '@/crypto/symmetric';

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
                    return {
                      publicKey: 'TODO: generate RSA public key',
                      privateKey: 'TODO: generate RSA private key',
                    };
                  }}
                  onEncrypt={(_pt, pubKey) => {
                    console.log('[App] RSA encrypt with pubKey length', pubKey.length);
                    return 'TODO: implement RSA encryption';
                  }}
                  onDecrypt={(_ct, privKey) => {
                    console.log('[App] RSA decrypt with privKey length', privKey.length);
                    return 'TODO: implement RSA decryption';
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
                    return 'TODO: implement hash computation';
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
