import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer, MainMenu } from '@/components/layout';
import { SymmetricPage, AsymmetricPage, HashPage } from '@/pages';

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
                  onEncrypt={(_algo, _mode, _pt, key) => {
                    console.log('[App] encrypt with key length', key.length);
                    return 'TODO: implement symmetric encryption';
                  }}
                  onDecrypt={(_algo, _mode, _ct, key) => {
                    console.log('[App] decrypt with key length', key.length);
                    return 'TODO: implement symmetric decryption';
                  }}
                  onGenerateKey={(_algo) => {
                    console.log('[App] generate key for', _algo);
                    return 'TODO: implement key generation';
                  }}
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
