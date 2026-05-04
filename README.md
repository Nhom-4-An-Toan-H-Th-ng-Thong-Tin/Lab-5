# Báo Cáo Bài Lab 5 — Cryptography Toolkit

> **Mã nguồn:** Cryptography Toolkit
> **Mục đích:** Ứng dụng web minh họa các thuật toán mã hóa đối xứng, mã hóa bất đối xứng (RSA) và hàm băm trong môn An toàn Hệ thống Thông tin.

---

## Mục lục

1. [Cấu trúc thư mục dự án](#1-cấu-trúc-thư-mục-dự-án)
2. [Thư viện sử dụng](#2-thư-viện-sử-dụng)
3. [Tổ chức mã nguồn](#3-tổ-chức-mã-nguồn)
4. [Kiến trúc hệ thống & Luồng hoạt động](#4-kiến-trúc-hệ-thống--luồng-hoạt-động)
5. [Chi tiết từng module](#5-chi-tiết-từng-module)
6. [Mô hình dữ liệu & Kiểu dữ liệu](#6-mô-hình-dữ-liệu--kiểu-dữ-liệu)
7. [Giao diện người dùng (UI)](#7-giao-diện-người-dùng-ui)
8. [Styling & Design System](#8-styling--design-system)
9. [Tính năng đã hoàn thành & Còn dang dở](#9-tính-năng-đã-hoàn-thành--còn-dang-dở)
10. [Hướng dẫn chạy dự án](#10-hướng-dẫn-chạy-dự-án)

---

## 1. Cấu trúc thư mục dự án

```
Lab-5/
├── .git/                          # Git repository
├── .gitignore
├── index.html                     # Entry HTML
├── package.json                   # Dependencies & scripts
├── package-lock.json
├── README.md                      # File hiện tại
├── tsconfig.json                  # TypeScript config cho source code
├── tsconfig.node.json             # TypeScript config cho Vite
├── vite.config.ts                 # Cấu hình Vite bundler
├── public/
│   └── favicon.svg                # Icon ứng dụng (SVG shield)
├── dist/                          # Thư mục build output (sau khi compile)
│   ├── index.html
│   ├── favicon.svg
│   └── assets/
│       ├── index-Cun2pb4Q.css
│       └── index-BsTcPWPR.js
└── src/
    ├── main.tsx                   # React entry point
    ├── App.tsx                    # Root component + Routing
    ├── vite-env.d.ts              # Type declarations cho Vite
    ├── types/
    │   └── index.ts               # Shared TypeScript type definitions
    ├── crypto/
    │   ├── index.ts               # Barrel export
    │   ├── symmetric.ts           # Mã hóa đối xứng (DES, 3DES, AES)
    │   ├── asymmetric.ts          # Mã hóa bất đối xứng RSA
    │   └── hash.ts               # Hàm băm (MD5, SHA-256)
    ├── pages/
    │   ├── index.ts               # Barrel export
    │   ├── SymmetricPage.tsx      # Trang mã hóa đối xứng
    │   ├── AsymmetricPage.tsx     # Trang RSA
    │   └── HashPage.tsx           # Trang hàm băm
    ├── components/
    │   └── layout/
    │       ├── index.ts            # Barrel export
    │       ├── Header.tsx          # Thanh điều hướng (sticky)
    │       ├── Footer.tsx          # Chân trang
    │       └── MainMenu.tsx       # Trang chủ + Feature cards
    └── styles/
        ├── globals.css             # CSS variables & base styles
        └── components.css          # Shared component styles
```

---

## 2. Thư viện sử dụng

| Thư viện | Phiên bản | Vai trò |
|---|---|---|
| **react** | ^19.2.5 | Framework UI chính |
| **react-dom** | ^19.2.5 | Render React lên DOM |
| **react-router-dom** | ^7.14.2 | Client-side routing (SPA navigation) |
| **crypto-js** | ^4.2.0 | Mã hóa đối xứng (DES, 3DES, AES) + Hash (MD5, SHA) |
| **node-forge** | ^1.4.0 | Mã hóa bất đối xứng RSA (sinh khóa, mã hóa, giải mã) |
| **lucide-react** | ^1.14.0 | Thư viện icon SVG (shield, key, lock, hash,...) |
| **vite** | ^8.0.10 | Build tool & dev server (thay thế webpack) |
| **typescript** | ^6.0.3 | Type safety, gõ tĩnh cho toàn bộ source |

**Dev Dependencies:**

| Thư viện | Phiên bản | Vai trò |
|---|---|---|
| `@types/crypto-js` | ^4.2.2 | TypeScript type definitions cho crypto-js |
| `@types/react` | ^19.2.14 | TypeScript types cho React |
| `@types/react-dom` | ^19.2.3 | TypeScript types cho React DOM |
| `@vitejs/plugin-react` | ^6.0.1 | Vite plugin hỗ trợ React JSX |

### Lý do chọn thư viện

- **crypto-js**: Thư viện JavaScript thuần, chạy trực tiếp trên trình duyệt, hỗ trợ đầy đủ DES, 3DES, AES, MD5, SHA — không cần cài thêm backend.
- **node-forge**: Cung cấp implementation RSA đầy đủ hơn crypto-js (sinh cặp khóa RSA với kích thước tùy ý, mã hóa/giải mã RSAES-PKCS1-V1_5).
- **lucide-react**: Thư viện icon SVG nhẹ, đẹp, tích hợp tốt với React.

---

## 3. Tổ chức mã nguồn

Mã nguồn tuân theo mô hình **Layered Architecture** với 4 tầng rõ ràng:

```
┌─────────────────────────────────────────────┐
│            UI Layer (Pages/Components)       │
│   SymmetricPage, AsymmetricPage, HashPage  │
│   Header, Footer, MainMenu                  │
├─────────────────────────────────────────────┤
│        Logic/Callback Layer (App.tsx)       │
│   Nhận callback props từ UI → gọi crypto  │
├─────────────────────────────────────────────┤
│       Crypto Layer (src/crypto/)            │
│   symmetric.ts, asymmetric.ts, hash.ts      │
├─────────────────────────────────────────────┤
│         Type/Model Layer (src/types/)        │
│   TypeScript interfaces & types             │
└─────────────────────────────────────────────┘
```

**Pattern quan trọng:** `App.tsx` đóng vai trò **callback bridge** — các page component nhận logic mã hóa qua props (`onEncrypt`, `onDecrypt`, `onGenerateKeyPair`,...) từ `App.tsx`, giữ cho UI tách biệt hoàn toàn khỏi business logic.

**Path alias:** Dự án dùng `@/` trỏ đến `src/`, cấu hình trong `tsconfig.json` và `vite.config.ts`. Ví dụ: `import { symmetricEncrypt } from '@/crypto/symmetric'`.

---

## 4. Kiến trúc hệ thống & Luồng hoạt động

### 4.1 Luồng khởi tạo ứng dụng

```
index.html (#root div)
  → main.tsx
    → ReactDOM.createRoot()
      → <React.StrictMode> → <App />
        → <BrowserRouter>
            → <Header /> (sticky nav)
            → <Routes>
                ├── /         → <MainMenu />
                ├── /symmetric → <SymmetricPage />
                ├── /asymmetric → <AsymmetricPage />
                └── /hash     → <HashPage />
            → <Footer />
```

### 4.2 Luồng Mã hóa Đối xứng (Symmetric Encryption)

```
User chọn thuật toán (DES / 3DES / AES) + chế độ (CBC / ECB)
  → User nhập plaintext
  → User nhập secret key (hoặc bấm "Generate Random Key")
    → App.tsx gọi generateSymmetricKey({ algorithm })
      → crypto.ts sinh ngẫu nhiên N bytes theo thuật toán
      → DES: 8 bytes (16 ký tự hex) | 3DES: 24 bytes (48 ký tự hex) | AES: 16 bytes (32 ký tự hex)
  → User bấm "Encrypt"
    → App.tsx gọi symmetricEncrypt(algorithm, plaintext, key, mode)
      → parseKey(): tự động phát hiện hex key vs UTF-8 key
      → validateSymmetricKey(): kiểm tra độ dài key đúng chuẩn
      → CBC mode:
          DES/3DES: sinh IV ngẫu nhiên 8 bytes (16 ký tự hex) → prepend vào ciphertext
          AES: sinh IV ngẫu nhiên 16 bytes (32 ký tự hex) → prepend vào ciphertext
      → DES/3DES/AES: CryptoJS.DES/TripleDES/AES.encrypt() với padding PKCS7
      → Trả về ciphertext dạng hex string
    → SymmetricPage hiển thị kết quả + nút Copy

Giải mã (Decrypt):
  → User dán ciphertext + key + bấm "Decrypt"
    → App.tsx gọi symmetricDecrypt(algorithm, ciphertext, key, mode)
      → CBC mode:
          DES/3DES: tách 16 ký tự hex đầu tiên (IV 8 bytes) → phần còn lại là raw ciphertext
          AES: tách 32 ký tự hex đầu tiên (IV 16 bytes) → phần còn lại là raw ciphertext
      → ECB: toàn bộ là raw ciphertext
      → CryptoJS.DES/TripleDES/AES.decrypt() → decode UTF-8
      → Trả về plaintext gốc
    → SymmetricPage hiển thị plaintext đã giải mã
```

### 4.3 Luồng Mã hóa Bất đối xứng (RSA)

```
User chọn kích thước khóa (1024/2048/4096 bits)
  → User bấm "Generate Key Pair"
    → App.tsx gọi generateRSAKeyPair(bits)
      → node-forge: forge.pki.rsa.generateKeyPair(bits)
      → Chuyển sang định dạng PEM (PEM = Base64 của DER + header/footer ASCII)
      → Trả về { publicKey: PEM string, privateKey: PEM string }
    → AsymmetricPage hiển thị 2 khóa, nút Copy

Mã hóa (Encrypt):
  → User nhập plaintext
  → User bấm "Encrypt"
    → App.tsx gọi rsaEncrypt(plaintext, publicKeyPem)
      → forge.pki.publicKeyFromPem() parse public key
      → publicKey.encrypt(plaintext, "RSAES-PKCS1-V1_5")
      → forge.util.encode64() → Base64 ciphertext
      → Trả về chuỗi Base64
    → AsymmetricPage hiển thị ciphertext (Base64)

Giải mã (Decrypt):
  → User dán Base64 ciphertext
  → User bấm "Decrypt"
    → App.tsx gọi rsaDecrypt(ciphertext, privateKeyPem)
      → forge.pki.privateKeyFromPem() parse private key
      → forge.util.decode64() → raw bytes
      → privateKey.decrypt() với scheme RSAES-PKCS1-V1_5
      → Trả về plaintext UTF-8 gốc
    → AsymmetricPage hiển thị plaintext
```

### 4.4 Luồng Hàm Băm (Hash)

```
User chọn thuật toán (MD5 / SHA-256)
  → User nhập text vào textarea
  → User bấm "Compute Hash"
    → App.tsx gọi computeHash(algorithm, text)
      → MD5: CryptoJS.MD5(text).toString(CryptoJS.enc.Hex)
          → Trả về chuỗi hex 32 ký tự (128-bit digest)
      → SHA-256: CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex)
          → Trả về chuỗi hex 64 ký tự (256-bit digest)
    → HashPage hiển thị hash digest
    → HashPage hiển thị metadata: input length, output length, bits
```

---

## 5. Chi tiết từng module

### 5.1 `src/crypto/symmetric.ts` — Mã hóa đối xứng

**Các hàm chính:**

| Hàm | Tham số | Mô tả |
|---|---|---|
| `generateSymmetricKey(options)` | `KeyGenerationOptions` | Sinh khóa ngẫu nhiên dạng hex. DES=8 bytes (16 hex), 3DES=24 bytes (48 hex), AES=16 bytes (32 hex) |
| `symmetricEncrypt(algorithm, plaintext, key, mode)` | `SymmetricAlgorithm, string, string, SymmetricMode` | Mã hóa plaintext. CBC mode: prepend IV vào trước ciphertext (DES/3DES: IV=8B=16 hex; AES: IV=16B=32 hex). Padding: PKCS7 |
| `symmetricDecrypt(algorithm, ciphertext, key, mode)` | `SymmetricAlgorithm, string, string, SymmetricMode` | Giải mã ciphertext. CBC: DES/3DES tách 16 hex đầu (IV 8B), AES tách 32 hex đầu (IV 16B). Kiểm tra plaintext sau decode, trả lỗi nếu không decode được |
| `validateSymmetricKey(algorithm, key)` | `SymmetricAlgorithm, string` | Kiểm tra độ dài key (bytes) khớp với chuẩn thuật toán |
| `getExpectedKeySize(algorithm)` | `SymmetricAlgorithm` | Trả về số bytes yêu cầu: DES=8, 3DES=24, AES=16 |

**Hàm phụ:**
- `parseKey(key)`: Tự động phát hiện format key. Nếu key chỉ chứa `0-9a-fA-F` và có độ dài chẵn → parse as hex. Ngược lại → parse as UTF-8 string. Điều này cho phép cả khóa hex (do hệ thống sinh) và khóa text (do người dùng nhập) đều hoạt động.

**Trạng thái triển khai:**

| Thuật toán | Mã hóa | Giải mã | Ghi chú |
|---|---|---|---|
| DES | ✅ Hoàn thành | ✅ Hoàn thành | Key: 8 bytes, IV: 8 bytes |
| 3DES | ✅ Hoàn thành | ✅ Hoàn thành | Key: 24 bytes (hoặc 16 bytes rút gọn) |
| AES | ✅ Hoàn thành | ✅ Hoàn thành | Key: 16 bytes, IV: 16 bytes (CBC) |

### 5.2 `src/crypto/asymmetric.ts` — Mã hóa bất đối xứng RSA

**Các hàm chính:**

| Hàm | Tham số | Mô tả |
|---|---|---|
| `generateRSAKeyPair(bits)` | `number` (default: 2048) | Sinh cặp khóa RSA. Hỗ trợ 1024/2048/4096 bits. Trả về định dạng PEM |
| `rsaEncrypt(plaintext, publicKeyPem)` | `string, string` | Mã hóa với public key. Output: Base64 encoded |
| `rsaDecrypt(ciphertext, privateKeyPem)` | `string, string` | Giải mã Base64 ciphertext với private key |

**Thuật toán sử dụng:**
- Key generation: `forge.pki.rsa.generateKeyPair()`
- Encryption scheme: **RSAES-PKCS1-V1_5** (RFC 3447)
- Encoding: **PEM** cho khóa (ASCII-armored Base64), **Base64** cho ciphertext

**Trạng thái triển khai:** ✅ Hoàn thành đầy đủ (sinh khóa, mã hóa, giải mã)

### 5.3 `src/crypto/hash.ts` — Hàm băm

**Các hàm chính:**

| Hàm | Tham số | Mô tả |
|---|---|---|
| `computeHash(algorithm, text)` | `HashAlgorithm, string` | Tính hash digest. Trả về hex string |
| `getHashAlgorithmDescription(algorithm)` | `HashAlgorithm` | Trả về mô tả thuật toán bằng tiếng Anh |

**Trạng thái triển khai:**

| Thuật toán | Trạng thái | Output |
|---|---|---|
| MD5 | ✅ Hoàn thành | 128-bit = 32 ký tự hex |
| SHA-256 | ✅ Hoàn thành | 256-bit = 64 ký tự hex |

---

## 6. Mô hình dữ liệu & Kiểu dữ liệu

### 6.1 Type Definitions (`src/types/index.ts`)

```typescript
// Thuật toán & chế độ
SymmetricAlgorithm = 'DES' | '3DES' | 'AES'
SymmetricMode      = 'CBC' | 'ECB'
HashAlgorithm      = 'MD5' | 'SHA-256'

// Kết quả mã hóa đối xứng
SymmetricResult {
  success: boolean
  data?:   string   // ciphertext (encrypt) hoặc plaintext (decrypt)
  error?:  string
}

// Cặp khóa RSA
RSAKeyPair {
  publicKey:  string   // PEM format
  privateKey: string   // PEM format
}

RSAKeyPairResult {
  success: boolean
  keyPair?: RSAKeyPair
  error?:  string
}

// Kết quả mã hóa bất đối xứng
AsymmetricResult {
  success: boolean
  data?:   string   // Base64 ciphertext (encrypt) hoặc plaintext (decrypt)
  error?:  string
}

// Kết quả hash
HashResult {
  success: boolean
  digest?: string   // hex digest
  error?:  string
}
```

### 6.2 Error Handling Pattern

Tất cả các hàm crypto đều trả về object kết quả với pattern `Result { success, data?, error? }`. Pages kiểm tra `success`, throw `Error` nếu thất bại (được catch trong try/catch), và hiển thị error message. Pattern này đảm bảo **defensive programming** xuyên suốt ứng dụng.

---

## 7. Giao diện người dùng (UI)

### 7.1 Trang chủ — `MainMenu.tsx`
- Icon shield lớn + tiêu đề "Cryptography Toolkit"
- 3 feature cards với icon, mô tả ngắn:
  - 🗝️ Symmetric Encryption (DES, 3DES, AES)
  - 🔒 Asymmetric Encryption (RSA key generation, encryption, decryption)
  - #️⃣ Hash Functions (MD5, SHA-256)
- Hover effect: dịch sang phải 4px + border màu accent + shadow
- Left accent bar 3px hiện khi hover

### 7.2 Trang Symmetric — `SymmetricPage.tsx`
- Settings card: chọn Algorithm (AES/3DES/DES) + Mode (CBC/ECB)
- Key size info hiển thị tự động theo thuật toán
- "Generate Random Key" → sinh khóa hex, tự động điền vào cả 2 trường key
- 2 tabs: Encryption / Decryption
- Input validation: empty check + key length check
- Result box màu xanh lá với nút Copy + Try Again
- Error message hiển thị bên dưới nếu thất bại

### 7.3 Trang Asymmetric — `AsymmetricPage.tsx`
- Key size selector: 1024 / 2048 / 4096 bits
- "Generate Key Pair" → hiển thị 2 khóa PEM với nút Copy riêng
- Encrypt button disabled cho đến khi có khóa
- 2 tabs: Encryption (Public Key) / Decryption (Private Key)
- Ciphertext output là Base64 (hiển thị đa dòng với `white-space: pre-wrap`)

### 7.4 Trang Hash — `HashPage.tsx`
- Algorithm selector với mô tả ngắn (SHA-256 recommended, MD5 unsafe)
- Compute Hash button (màu xanh emerald)
- Result card hiển thị hash digest (màu xanh lá nhạt, monospace)
- Metadata row: input length, output length (hex chars), algorithm name, output bits

### 7.5 Shared Layout (`Header` + `Footer`)
- **Header**: Sticky với `backdrop-filter: blur(12px)` (glassmorphism), logo "Crypto Toolkit" + 4 nav links (Home, Symmetric, Asymmetric, Hash). Active link có background accent.
- **Footer**: Text mô tả "Educational Project for Information Security" + badge "Lab 5".

---

## 8. Styling & Design System

### 8.1 CSS Architecture
- **globals.css**: CSS custom properties (design tokens), global reset, body/app wrapper, scrollbar, responsive page-content
- **components.css**: Shared utility classes (card, btn, form-*, result-box, error-message, etc.)
- **Inline `<style>`**: Mỗi page/component có CSS scoped inline để giữ tính độc lập

### 8.2 Design Tokens (CSS Variables)

| Token | Giá trị | Sử dụng |
|---|---|---|
| `--color-bg-primary` | `#0f1117` | Background chính (nền tối) |
| `--color-bg-card` | `#1e2230` | Card backgrounds |
| `--color-bg-input` | `#252a3a` | Input/textarea backgrounds |
| `--color-accent` | `#7c3aed` | Buttons, active states ( tím ) |
| `--color-success` | `#10b981` | Success states, hash output ( xanh lá ) |
| `--color-error` | `#ef4444` | Error messages ( đỏ ) |
| `--font-sans` | Inter | Body font |
| `--font-mono` | Fira Code | Code/monospace font |
| `--radius-md` | 10px | Border radius trung bình |

### 8.3 Responsive Design
- Header brand text ẩn trên màn hình nhỏ (< 480px)
- Page content padding tăng từ 2rem → 3rem trên tablet
- Menu cards responsive grid
- Form inputs 100% width

---

### 9. Tính năng đã hoàn thành

| Tính năng | File | Chi tiết |
|---|---|---|
| DES encryption/decryption | `symmetric.ts` | CBC + ECB, hex I/O, PKCS7 padding |
| 3DES encryption/decryption | `symmetric.ts` | CBC + ECB, hex I/O, PKCS7 padding |
| AES encryption/decryption | `symmetric.ts` | CBC + ECB, hex I/O, PKCS7 padding, IV: 16 bytes |
| Key generation (DES/3DES/AES) | `symmetric.ts` | Random hex key: DES=8B, 3DES=24B, AES=16B |
| Key validation | `symmetric.ts` | Byte length checking per algorithm |
| RSA key generation | `asymmetric.ts` | 1024/2048/4096 bits, PEM output |
| RSA encryption | `asymmetric.ts` | RSAES-PKCS1-V1_5, Base64 output |
| RSA decryption | `asymmetric.ts` | RSAES-PKCS1-V1_5, UTF-8 output |
| MD5 hashing | `hash.ts` | 128-bit hex digest |
| SHA-256 hashing | `hash.ts` | 256-bit hex digest |
| Hash algorithm descriptions | `hash.ts` | Human-readable descriptions |
| React Router navigation | `App.tsx` | 4 routes, BrowserRouter |
| Header/Footer layout | `Header.tsx`, `Footer.tsx` | Sticky nav, glassmorphism |
| MainMenu home page | `MainMenu.tsx` | Feature cards with hover effects |
| SymmetricPage UI | `SymmetricPage.tsx` | Full UI với tabs, validation |
| AsymmetricPage UI | `AsymmetricPage.tsx` | Full UI với key display |
| HashPage UI | `HashPage.tsx` | Full UI với metadata display |
| TypeScript types | `types/index.ts` | Full type safety |
| Copy to clipboard | All pages | Clipboard API + visual feedback |
| Error handling | All pages | try/catch + error display |

---
