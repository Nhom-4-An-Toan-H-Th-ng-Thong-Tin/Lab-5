import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header, Footer, MainMenu } from "@/components/layout";
import { SymmetricPage, AsymmetricPage, HashPage } from "@/pages";
import {
  symmetricEncrypt,
  symmetricDecrypt,
  generateSymmetricKey,
} from "@/crypto/symmetric";
import { computeHash } from "./crypto/hash"; // ← Import dòng này
import {
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
} from "./crypto/asymmetric";
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
                  onGenerateKey={(algo) =>
                    generateSymmetricKey({ algorithm: algo })
                  }
                />
              }
            />
            <Route
              path="/asymmetric"
              element={
                <AsymmetricPage
                  onGenerateKeyPair={(bits) => {
                    return generateRSAKeyPair(bits);
                  }}
                  onEncrypt={(plaintext, pubKey) => {
                    return rsaEncrypt(plaintext, pubKey);
                  }}
                  onDecrypt={(ciphertext, privKey) => {
                    return rsaDecrypt(ciphertext, privKey);
                  }}
                />
              }
            />
            <Route
              path="/hash"
              element={
                <HashPage
                  onComputeHash={(algo, text) => {
                    console.log("[App] compute", algo, "hash of", text);
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
