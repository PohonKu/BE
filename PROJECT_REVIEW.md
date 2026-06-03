# Pohonku Backend — Project Review

> Dibuat: 2026-03-28 | Reviewer: Claude Code

---

## Daftar Isi

1. [Ringkasan Proyek](#1-ringkasan-proyek)
2. [Arsitektur](#2-arsitektur)
3. [Stack Teknologi](#3-stack-teknologi)
4. [Database Schema](#4-database-schema)
5. [Alur Sistem Utama](#5-alur-sistem-utama)
6. [Analisis Per Layer](#6-analisis-per-layer)
7. [Optimasi yang Bisa Dilakukan](#7-optimasi-yang-bisa-dilakukan)
8. [Celah Keamanan](#8-celah-keamanan)
9. [Prioritas Perbaikan](#9-prioritas-perbaikan)

---

## 1. Ringkasan Proyek

**Pohonku** adalah platform adopsi pohon berbasis web. Pengguna bisa menelusuri katalog spesies pohon, mengadopsi pohon dengan memilih durasi (1 atau 3 tahun), membayar via Midtrans, lalu memantau pertumbuhan pohon yang diadopsi melalui update berkala dari admin.

**Fitur Utama:**
- Registrasi & login (email/password + Google OAuth)
- Katalog spesies pohon dengan filter kategori & pencarian
- Sistem order & pembayaran (Midtrans Snap)
- Manajemen adopsi (aktif/kadaluarsa) dengan statistik CO₂
- Upload foto & update pertumbuhan pohon oleh admin
- Upload file via Cloudinary (signed upload)
- Sertifikat adopsi (placeholder, belum diimplementasi)

---

## 2. Arsitektur

### Pola Arsitektur: Layered (N-Tier)

```
Request
   │
   ▼
┌─────────────────────────────────────┐
│          Routes Layer               │  ← Definisi endpoint & middleware chain
│  auth, tree, user, order,           │
│  adoption, treeUpdate, upload       │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│        Controllers Layer            │  ← Parsing req/res, memanggil service
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│         Services Layer              │  ← Business logic, validasi, transformasi
│  auth, tree, order, payment,        │
│  adoption, treeUpdate               │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│       Repository Layer              │  ← Akses database (Prisma queries)
│  user, tree, order, adoption,       │
│  treeUpdate                         │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│     PostgreSQL (via Prisma ORM)     │
└─────────────────────────────────────┘
```

### Komponen Pendukung

```
src/
├── config/         ← Konfigurasi eksternal (OAuth, DB, Cloudinary, Midtrans)
├── middleware/     ← Auth, admin guard, validation, error handler, upload
├── utils/          ← JWT, password, response format, tree calc, order number gen
└── types/          ← Tipe TypeScript custom
```

### Struktur Direktori Lengkap

```
BE/
├── src/
│   ├── index.ts                   ← Entry point Express
│   ├── config/
│   │   ├── oauth.ts               ← Passport strategies (JWT + Google)
│   │   ├── database.ts            ← Prisma client singleton
│   │   ├── storage.ts             ← Cloudinary config
│   │   └── midtrans.ts            ← Midtrans snap client
│   ├── middleware/
│   │   ├── middleware.ts          ← JSON, CORS setup
│   │   ├── auth.middleware.ts     ← JWT authentication
│   │   ├── admin.middleware.ts    ← Role authorization
│   │   ├── validation.middleware.ts ← Zod schema validation
│   │   ├── error.middleware.ts    ← Global error handler
│   │   └── upload.middleware.ts   ← Multer file upload
│   ├── routes/                    ← 7 router files
│   ├── controllers/               ← 7 controller files
│   ├── services/                  ← 8 service files (2 kosong)
│   ├── repository/                ← 5 repository files
│   ├── utils/                     ← 6 utility files (1 kosong)
│   └── types/                     ← Type definitions
├── prisma/
│   ├── schema.prisma              ← 7 model database
│   └── migrations/
├── docker-compose.yml
├── Dockerfile
└── .env
```

---

## 3. Stack Teknologi

| Komponen | Teknologi | Versi |
|----------|-----------|-------|
| Runtime | Node.js | - |
| Framework | Express | 5.2.1 |
| Bahasa | TypeScript | 5.9.3 |
| ORM | Prisma | 7.3.0 |
| Database | PostgreSQL | 15 |
| Auth | JWT + Passport.js | - |
| OAuth | Google OAuth 2.0 | - |
| Password | bcryptjs | - |
| Payment | Midtrans Node Client | - |
| Storage | Cloudinary | - |
| Validasi | Zod | - |
| Containerisasi | Docker + Docker Compose | - |
| Deploy DB | Railway | - |
| Deploy FE | Vercel | - |

---

## 4. Database Schema

### Diagram Relasi

```
User ──────────────┬──── Order ──────────── OrderItem ──── TreeSpecies
                   │         │                                    │
                   │         └──── Adoption ◄────────────────────┘
                   │                   │
                   └──────────────────►│
                                       ▼
                                     Tree ──── TreeUpdate
```

### Model & Catatan Penting

| Model | Field Kritis | Catatan |
|-------|-------------|---------|
| `User` | `passwordHash`, `googleId` | `passwordHash` nullable (OAuth user) |
| `TreeSpecies` | `availabelStok`, `reservedStok` | Typo: `availabel` → `available` |
| `Tree` | `serialNumber`, `status` | Status: AVAILABLE/BOOKED/SOLD |
| `Order` | `paymentStatus`, `snapToken`, `expiredAt` | Expiry 24 jam |
| `OrderItem` | `durationYears`, `priceAtPurchase` | Relasi 1-to-1 dengan Order |
| `Adoption` | `expiresAt`, `certificateUrl` | Certificate belum diimplementasi |
| `TreeUpdate` | `co2AbsorbedTotal`, `heightCm` | Dibuat admin |

---

## 5. Alur Sistem Utama

### Alur Adopsi Pohon

```
1. User browse katalog spesies
         ↓
2. User pilih spesies + durasi (1/3 tahun)
         ↓
3. POST /api/v1/orders
   - Stock available -= 1
   - Stock reserved += 1
   - Order PENDING dibuat (expired 24 jam)
         ↓
4. POST /api/v1/orders/:id/payment
   - Midtrans Snap token dibuat
   - Token disimpan ke DB
         ↓
5. User bayar via Midtrans Snap
         ↓
6. POST /api/v1/orders/webhook (dari Midtrans)
   ├── SUCCESS:
   │   - Tree baru dibuat dengan serial number unik
   │   - Adoption dibuat (dengan expiresAt)
   │   - Stock reserved -= 1 (final)
   │   - Order status → PAID
   └── FAILED:
       - Stock reserved → available (rollback)
       - Order status → FAILED
         ↓
7. User pantau pohon via dashboard adoptions
         ↓
8. Admin buat TreeUpdate (foto, tinggi, diameter, CO₂)
         ↓
9. User lihat statistik: growth phase, health status, CO₂
```

### Alur Auth

```
Email/Password:
  POST /register → bcrypt hash → simpan ke DB
  POST /login → verifikasi hash → JWT access + refresh token

Google OAuth:
  GET /google → redirect ke Google
  GET /google/callback → Passport → cari/buat user → JWT tokens

Token Refresh:
  POST /refresh → verifikasi refresh token → JWT access token baru
```

---

## 6. Analisis Per Layer

### Routes
- Struktur sudah baik dan konsisten
- Penamaan: ada typo di `uploud.routes.ts` (harusnya `upload`)
- Beberapa endpoint duplikat di adoption (misalnya `/stats` dan `/statistik`)

### Controllers
- Sudah tipis (thin controller), delegasi ke service — bagus
- Beberapa controller mengembalikan error tanpa type guard yang konsisten

### Services
- Logic bisnis sudah dipisahkan dengan baik
- `user.service.ts`, `certificate.service.ts`, `upload.service.ts` masih **kosong** — belum diimplementasi
- `adoption.service.ts` sangat gemuk (banyak transformasi data yang bisa dipecah)

### Repository
- Sudah memisahkan query DB dengan baik
- Beberapa query tidak menggunakan index yang optimal (lihat bagian Optimasi)

### Utils
- `validator.util.ts` masih **kosong**
- `tree.util.ts` memiliki kalkulasi yang bagus untuk growth phase dan health status

---

## 7. Optimasi yang Bisa Dilakukan

### 7.1 Database & Query

**a. Tambah Indeks pada Field yang Sering di-Query**
```prisma
// Di schema.prisma, tambahkan:
model Order {
  @@index([userId, paymentStatus])  // GET orders per user + filter status
  @@index([expiredAt])              // Untuk cleanup expired orders
}

model Adoption {
  @@index([userId, expiresAt])      // Dashboard aktif/kadaluarsa
}

model Tree {
  @@index([speciesId, status])      // Filter available trees per species
}

model TreeUpdate {
  @@index([treeId, createdAt])      // Timeline updates per tree
}
```

**b. N+1 Query di Adoption Service**

Di `adoption.service.ts`, method `getUserAdoptionBaru()` memuat semua relasi sekaligus. Pastikan `include` nested di repository tidak mengakibatkan N+1:
```typescript
// Pastikan sudah ada di repository include:
include: {
  tree: { include: { treeUpdates: { orderBy: { createdAt: 'desc' }, take: 1 } } },
  species: true
}
// Hindari memanggil query tambahan per iterasi di service
```

**c. Cleanup Expired Orders**

Order yang kadaluarsa (PENDING + `expiredAt` sudah lewat) tidak pernah dibersihkan. Tambahkan cron job atau background job:
```typescript
// Contoh: jalankan setiap jam
// Rollback stock untuk expired orders
prisma.order.findMany({
  where: { paymentStatus: 'PENDING', expiredAt: { lt: new Date() } }
})
```

**d. Pagination di Semua List Endpoint**

Endpoint list (species, orders, adoptions, admin views) tidak ada paginasi — berbahaya jika data besar:
```typescript
// Tambahkan query params: ?page=1&limit=20
const skip = (page - 1) * limit;
prisma.treeSpecies.findMany({ skip, take: limit });
```

---

### 7.2 Performa Aplikasi

**a. Response Caching untuk Data Statis**

Data spesies pohon jarang berubah. Tambahkan in-memory cache (atau Redis) untuk mengurangi load DB:
```typescript
// Gunakan node-cache atau ioredis
// Cache species list dengan TTL 5 menit
```

**b. Kompresi HTTP**

Tambahkan `compression` middleware untuk mengurangi ukuran response:
```bash
npm install compression @types/compression
```
```typescript
import compression from 'compression';
app.use(compression());
```

**c. Batasi Ukuran Request Body**

Saat ini tidak ada limit ukuran body:
```typescript
app.use(express.json({ limit: '10kb' }));  // Cegah payload terlalu besar
```

**d. Connection Pooling**

Pastikan Prisma tidak membuat koneksi baru di setiap request. Singleton sudah ada di `database.ts` — pastikan tidak ada `new PrismaClient()` di tempat lain:
```typescript
// Verifikasi: hanya ada 1 instance PrismaClient di seluruh codebase
```

---

### 7.3 Kode & Maintainability

**a. File Kosong — Implementasikan atau Hapus**
- `src/services/user.service.ts` — kosong
- `src/services/certificate.service.ts` — kosong
- `src/services/upload.service.ts` — kosong
- `src/utils/validator.util.ts` — kosong
- `src/types/index.d.ts` — kosong

**b. Typo di Codebase**
- `availabelStok` → `availableStok` (di schema & semua referensinya)
- `uploud.routes.ts` → `upload.routes.ts`
- `adoptionPrize.utils.ts` → `adoptionPrice.utils.ts`

**c. Duplikasi Endpoint Adoption**

Ada dua endpoint dengan fungsi mirip:
- `GET /adoptions/stats` dan `GET /adoptions/statistik`
- Pilih satu, hapus yang lain, atau dokumentasikan perbedaannya

**d. Error Handling Tidak Konsisten**

Beberapa tempat menggunakan `try/catch` manual, beberapa tidak. Gunakan middleware error handler secara konsisten dengan melempar error ke `next(error)`:
```typescript
// Di controller:
export const getOrders = async (req, res, next) => {
  try {
    const data = await orderService.getUserOrders(req.user.id);
    sendSuccess(res, 'OK', data);
  } catch (error) {
    next(error);  // Delegasi ke error middleware
  }
};
```

**e. Environment Variable Validation**

Tambahkan validasi env var saat startup dengan Zod:
```typescript
// src/config/env.ts
import { z } from 'zod';
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  // ...
});
export const env = envSchema.parse(process.env);
```

**f. Logging yang Proper**

Tidak ada structured logging. Tambahkan logger seperti `pino` atau `winston`:
```bash
npm install pino pino-http
```

---

### 7.4 Arsitektur

**a. Refresh Token Tidak Disimpan di DB**

Refresh token saat ini hanya di-verify signature-nya, tidak dicek ke whitelist. Jika token dicuri, tidak bisa di-revoke sampai expired (7 hari).

**b. Webhook Signature Validation**

Midtrans webhook tidak diverifikasi signature-nya (lihat bagian keamanan).

---

## 8. Celah Keamanan

> **Tingkat Keparahan:** 🔴 Kritis | 🟠 Tinggi | 🟡 Sedang | 🟢 Rendah

---

### 🔴 KRITIS

#### SEC-01: Midtrans Webhook Tanpa Verifikasi Signature

**File:** `src/services/payment.service.ts` — method `handleWebhook()`

**Masalah:** Webhook dari Midtrans diterima dan diproses tanpa memverifikasi bahwa request benar-benar dari Midtrans. Siapa pun bisa mengirim POST ke `/api/v1/orders/webhook` dengan payload palsu untuk memalsukan status pembayaran.

**Risiko:** Seseorang bisa mengirim webhook palsu `transaction_status: settlement` untuk mendapatkan adopsi pohon gratis tanpa bayar.

**Fix:**
```typescript
// Midtrans mengirim signature_key di payload:
// SHA512(orderId + statusCode + grossAmount + serverKey)
import crypto from 'crypto';

function verifyMidtransSignature(payload: any, serverKey: string): boolean {
  const { order_id, status_code, gross_amount, signature_key } = payload;
  const expectedSignature = crypto
    .createHash('sha512')
    .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    .digest('hex');
  return expectedSignature === signature_key;
}

// Di handleWebhook():
if (!verifyMidtransSignature(webhookData, process.env.MIDTRANS_SERVER_KEY)) {
  throw new Error('Invalid webhook signature');
}
```

---

#### SEC-02: Secret Credentials Ter-commit ke Git

**File:** `.env`

**Masalah:** File `.env` berisi:
- `JWT_SECRET` dan `JWT_REFRESH_SECRET` (128-char hex)
- `MIDTRANS_SERVER_KEY` dan `MIDTRANS_CLIENT_KEY`
- `CLOUDINARY_API_SECRET`
- `GOOGLE_CLIENT_SECRET`
- `DATABASE_URL` dengan credentials Railway

**Risiko:** Jika repo ini pernah atau akan menjadi public, semua kredensial bocor. Bahkan di repo private, ini adalah praktek buruk.

**Fix:**
1. Tambahkan `.env` ke `.gitignore` — **segera periksa apakah sudah ada**
2. Buat `.env.example` dengan nilai placeholder
3. **Rotate semua secret yang sudah ter-commit** (JWT, Cloudinary, Midtrans, Google)
4. Gunakan secret manager (Railway Secrets, Doppler, dll.) untuk production

---

### 🟠 TINGGI

#### SEC-03: Refresh Token Tidak Diinvalidasi (Token Revocation)

**File:** `src/services/auth.service.ts`, `src/utils/jwt.util.ts`

**Masalah:** Refresh token (7 hari) tidak disimpan di database atau cache. Tidak ada mekanisme logout yang benar — token masih valid sampai expired meski user sudah "logout".

**Risiko:** Jika refresh token dicuri (XSS, MITM), attacker bisa mendapatkan access token baru selama 7 hari tanpa bisa di-stop.

**Fix:**
```typescript
// Simpan refresh token hash di DB:
model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique  // SHA256 dari token
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
}

// Saat logout: hapus dari DB
// Saat refresh: verifikasi ada di DB, lalu rotate (hapus lama, buat baru)
```

---

#### SEC-04: Rate Limiting Tidak Ada

**File:** `src/index.ts`, `src/middleware/middleware.ts`

**Masalah:** Tidak ada rate limiting pada endpoint apapun, terutama:
- `POST /auth/login` — rentan brute force password
- `POST /auth/register` — rentan spam registrasi
- `POST /auth/refresh` — rentan token refresh flood

**Fix:**
```bash
npm install express-rate-limit
```
```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 menit
  max: 10,                    // 10 request per window
  message: 'Terlalu banyak percobaan, coba lagi nanti'
});

app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
```

---

#### SEC-05: Authorization Lemah di Endpoint Admin

**File:** `src/routes/tree.routes.ts`

**Masalah:**
```typescript
// Ini TIDAK ada auth middleware:
router.post('/species', treeController.postSpecies);
router.post('/species/bulk', treeController.bulkCreateSpecies);
```
Endpoint create & bulk create species tidak dilindungi middleware sama sekali — siapa pun bisa menambah spesies pohon.

**Fix:**
```typescript
router.post('/species', authenticate, authorizeAdmin, treeController.postSpecies);
router.post('/species/bulk', authenticate, authorizeAdmin, treeController.bulkCreateSpecies);
```

---

#### SEC-06: IDOR di Endpoint Adoption & Order

**File:** `src/services/adoption.service.ts`, `src/services/order.service.ts`

**Masalah:** Beberapa endpoint menerima `:id` dari URL dan langsung query ke DB. Meski ada pengecekan `userId` di beberapa method, perlu dipastikan **semua** akses data user sudah difilter:

```typescript
// Verifikasi: apakah getAdoptionDetail() memvalidasi bahwa
// adoption.userId === req.user.id ?
```

**Fix:** Tambahkan ownership check yang eksplisit di **semua** repository method yang mengakses data berdasarkan ID:
```typescript
const adoption = await prisma.adoption.findFirst({
  where: { id, userId }  // Double filter: ID + ownership
});
if (!adoption) throw new Error('Not found');
```

---

### 🟡 SEDANG

#### SEC-07: CORS Terlalu Permisif saat FRONTEND_URL Tidak Diset

**File:** `src/middleware/middleware.ts`

**Masalah:**
```typescript
origin: process.env.FRONTEND_URL || 'https://pohonku-testing.vercel.app'
```
Jika `FRONTEND_URL` tidak diset, fallback ke hardcoded URL. Lebih baik gunakan whitelist array:
```typescript
const allowedOrigins = [
  'https://pohonku.vercel.app',
  'https://pohonku-testing.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}
```

---

#### SEC-08: Cloudinary Upload Signature Tidak Membatasi Folder/Tipe File

**File:** `src/controllers/cloudinary.controller.ts`

**Masalah:** Signature upload tidak membatasi `allowed_formats` (jpg, png saja) atau folder yang diperbolehkan. User bisa mengupload file berbahaya ke Cloudinary account proyek.

**Fix:**
```typescript
const paramsToSign = {
  timestamp,
  folder: 'pohonku/tree-updates',
  allowed_formats: 'jpg,jpeg,png,webp',
  max_file_size: 5000000  // 5MB
};
```

---

#### SEC-09: Error Messages Terlalu Verbose

**File:** Berbagai controller & service

**Masalah:** Beberapa error langsung mengembalikan pesan internal:
```typescript
// Hindari ini di production:
res.status(500).json({ error: error.message });
```

**Risiko:** Bocorkan stack trace, nama tabel DB, atau informasi internal ke client.

**Fix:** Gunakan error middleware yang membungkus semua error:
```typescript
// Hanya kirim pesan generic ke client
sendError(res, 'Internal server error', 500);
// Log detail ke server log saja
logger.error(error);
```

---

#### SEC-10: Password Tidak Divalidasi di Endpoint Update Profile

**File:** `src/routes/user.routes.ts`, user controller/service

**Masalah:** Jika user bisa update profile termasuk mengubah password, pastikan ada validasi:
- Konfirmasi password lama sebelum ganti baru
- Validasi kekuatan password baru

---

### 🟢 RENDAH

#### SEC-11: Tidak Ada Security Headers

**Masalah:** Tidak ada header keamanan HTTP seperti:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`

**Fix:**
```bash
npm install helmet
```
```typescript
import helmet from 'helmet';
app.use(helmet());
```

#### SEC-12: `testDb/test.ts` ada di Source Code

**File:** `src/testDb/test.ts`

**Masalah:** File test database ada di source code production. Sebaiknya dipindahkan ke folder `__tests__/` dan dikecualikan dari build.

#### SEC-13: JWT Secret Tidak Divalidasi Minimum Length

Meski secret sudah panjang (128 char), tambahkan runtime validation saat startup untuk memastikan tidak menggunakan secret lemah di environment lain.

---

## 9. Prioritas Perbaikan

### Segera (Sebelum Production / Sekarang)

| # | Item | File |
|---|------|------|
| 1 | Verifikasi Midtrans webhook signature | `payment.service.ts` |
| 2 | Pastikan `.env` tidak di-commit ke git | `.gitignore`, `.env` |
| 3 | Tambah auth ke endpoint species admin | `tree.routes.ts` |
| 4 | Tambah rate limiting di endpoint auth | `index.ts` |

### Jangka Pendek (Sprint Berikutnya)

| # | Item | File |
|---|------|------|
| 5 | Implementasi refresh token revocation | `auth.service.ts` + DB |
| 6 | Pagination di semua list endpoint | Semua repository |
| 7 | Tambah Helmet security headers | `index.ts` |
| 8 | Cron job cleanup expired orders | Service baru |
| 9 | Validasi env vars saat startup | `config/env.ts` baru |

### Jangka Menengah

| # | Item |
|---|------|
| 10 | Implementasi fitur yang masih kosong (certificate, user service) |
| 11 | Structured logging (pino/winston) |
| 12 | Database index optimization |
| 13 | Response caching untuk data statis |
| 14 | Perbaiki typo di schema (`availabelStok`) |
| 15 | Batasi payload size (`express.json({ limit: '10kb' })`) |

---

## Ringkasan Singkat

| Aspek | Nilai | Catatan |
|-------|-------|---------|
| Arsitektur | ✅ Baik | Layered pattern konsisten |
| TypeScript | ✅ Baik | Strict mode aktif |
| Separation of Concerns | ✅ Baik | Routes → Controller → Service → Repository |
| Error Handling | ⚠️ Perlu Perbaikan | Tidak konsisten, terlalu verbose |
| Keamanan Auth | ⚠️ Perlu Perbaikan | Tidak ada token revocation, rate limit |
| Keamanan Webhook | 🔴 Kritis | Tidak ada verifikasi signature |
| Kelengkapan Fitur | ⚠️ Belum Lengkap | Beberapa service masih kosong |
| Performa | ⚠️ Perlu Perbaikan | Tidak ada pagination, caching, atau index |
| Secret Management | 🔴 Kritis | Credentials mungkin ter-commit |

---

*Review ini dibuat berdasarkan analisis static code. Lakukan penetration testing dan security audit lebih lanjut sebelum deploy ke production.*
