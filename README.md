# 🌳 Pohonku - Tree Adoption Platform

**Live Demo:** https://pohonku-testing.vercel.app/

##  Deskripsi Proyek

**Pohonku** adalah platform digital yang memungkinkan pengguna untuk mengadopsi pohon secara virtual dan berkontribusi pada kelestarian lingkungan. Platform ini menghubungkan pengguna yang peduli lingkungan dengan proyek penanaman pohon, memberikan transparansi penuh tentang kondisi dan pertumbuhan pohon yang diadopsi.

###  Tujuan Bisnis

- **Konservasi Lingkungan** - Mendorong partisipasi masyarakat dalam gerakan penghijauan
- **Carbon Offset** - Memberikan solusi bagi individu dan korporat untuk offset emisi karbon
- **Edukasi Lingkungan** - Menyediakan informasi edukatif tentang berbagai spesies pohon dan manfaatnya
- **Transparansi & Kepercayaan** - Memberikan laporan berkala tentang pertumbuhan pohon yang diadopsi

##  Arsitektur Backend

### Tech Stack

- **Runtime & Framework**: Node.js + Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: JWT + Google OAuth 2.0
- **Payment Gateway**: Midtrans (QRIS, Bank Transfer, dll)
- **File Storage**: Cloudinary
- **Validation**: Zod
- **Password Hashing**: Bcryptjs

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│         Frontend (Next.js/React)                    │
│    https://pohonku-testing.vercel.app/             │
└────────────────────────┬────────────────────────────┘
                         │
                    API Calls
                         │
┌────────────────────────▼────────────────────────────┐
│         Backend (Express + TypeScript)              │
│  ├─ Routes (Auth, Trees, Orders, Adoptions)       │
│  ├─ Controllers (Business Logic)                   │
│  ├─ Middleware (Auth, Validation, Error Handling) │
│  └─ Utils (JWT, Password, Validators)             │
└────────────────────────┬────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼─────────┐ ┌───▼──────────┐
│  PostgreSQL    │ │  Cloudinary  │ │   Midtrans   │
│   Database     │ │   (Images)   │ │   (Payment)  │
└────────────────┘ └──────────────┘ └──────────────┘
```

##  Database Models

### Entity Relationship

```
Users (1) ──────── (N) Orders
  │                      │
  │                  OrderItems
  │                      │
  └──── (N) Adoptions ────┘
            │
            └──── Trees ──── TreeSpecies
                    │
                TreeUpdates
```

### Model Details

#### **Users**
- Manajemen akun pengguna
- Support autentikasi lokal (email/password) dan Google OAuth
- Role-based access (USER, ADMIN)
- Tracking email verification

#### **TreeSpecies**
- Katalog spesies pohon dengan informasi lengkap
- Harga base dan tingkat penyerapan karbon (CO₂/tahun)
- Rich text content untuk cerita & edukasi
- Tracking stok (available, reserved)

#### **Trees**
- Individu pohon fisik dengan serial number unik
- Tracking lokasi (latitude, longitude)
- Status lifecycle (AVAILABLE, BOOKED, SOLD)
- Linked ke spesies dan adoption records

#### **Orders & OrderItems**
- Transaksi adopsi pohon
- Integrasi Midtrans untuk payment
- Tracking status pembayaran (PENDING, PAID, FAILED)
- Snap token untuk UI payment gateway

#### **Adoptions**
- Merekam relasi antara user, tree, dan order
- Nama di tag pohon (personalisasi)
- Masa berlaku adoption
- Sertifikat digital (URL)

#### **TreeUpdates**
- Dokumentasi pertumbuhan pohon
- Tracking: tinggi, diameter, CO₂ yang diserap
- Foto progress dan catatan admin
- Historical data untuk monitoring

##  API Endpoints

### Authentication (`/api/v1/auth`)
```
POST   /register           - Daftar akun baru
POST   /login              - Login dengan email/password
GET    /google             - OAuth login dengan Google
GET    /google/callback    - OAuth callback
POST   /refresh-token      - Refresh JWT token
```

### Trees (`/api/v1/trees`)
```
GET    /species                      - Semua spesies pohon
GET    /species/:id                  - Detail spesies
GET    /species/category/:category   - Filter by kategori
GET    /                             - Pohon yang tersedia
POST   /species                      - Create spesies (admin)
POST   /species/bulk                 - Bulk create spesies
PATCH  /species/:id                  - Update spesies
```

### Orders (`/api/v1/orders`)
```
POST   /                    - Create order baru
GET    /:id                 - Get order details
GET    /                    - List orders user
PATCH  /:id/payment-status  - Update payment status
```

### Adoptions (`/api/v1/adoptions`)
```
GET    /                  - List semua adoptions
GET    /user/:userId      - Adoptions user tertentu
GET    /:adoptionId       - Detail adoption
POST   /                  - Create adoption (post payment)
GET    /:adoptionId/tree  - Info pohon yang diadopsi
```

### Tree Updates (`/api/v1/admin/trees/:treeId/updates`)
```
POST   /                - Admin post pertumbuhan pohon
GET    /                - List updates untuk pohon
```

### Users (`/api/v1/users`)
```
GET    /profile         - Get user profile
PATCH  /profile         - Update profile
GET    /adoptions       - List adoptions user
```

### Upload (`/api/v1/upload`)
```
POST   /                - Upload image ke Cloudinary
```

##  Fitur Utama

### 1. **Sistem Autentikasi Dual**
- Registrasi lokal dengan email & password
- Google OAuth 2.0 integration
- JWT-based session management
- Email verification system

### 2. **Catalog & Browse Pohon**
- Daftar lengkap spesies pohon dengan deskripsi
- Filtering berdasarkan kategori
- Info edukatif: carbon absorption rate, harga
- Tracking stok real-time

### 3. **Sistem Adopsi & Payment**
- Flow adopsi yang seamless
- Integrasi Midtrans untuk berbagai metode pembayaran
- QRIS, Bank Transfer, E-wallet support
- Personalisasi dengan nama di tag pohon
- Masa berlaku adopsi yang dapat di-renew

### 4. **Sertifikat Digital**
- Generate sertifikat adopsi otomatis
- Sharable & printable certificate
- Meningkatkan engagement pengguna

### 5. **Monitoring & Tracking**
- Admin dapat post updates tentang pertumbuhan pohon
- Foto progress regular
- Tracking metrik: tinggi, diameter, CO₂ yang diserap
- Historical data untuk analisis trend

### 6. **Admin Dashboard**
- Role-based access control
- Bulk upload spesies pohon
- Manage tree updates & metrics
- Order & payment management

##  Project Structure

```
BE/
├── src/
│   ├── config/
│   │   ├── database.ts          - Prisma client setup
│   │   ├── midtrans.ts          - Payment gateway config
│   │   ├── oauth.ts             - Google OAuth setup
│   │   └── storage.ts           - Cloudinary config
│   ├── controllers/
│   │   ├── auth.controller.ts   - Authentication logic
│   │   ├── tree.controller.ts   - Tree management
│   │   ├── order.controller.ts  - Order handling
│   │   ├── adoption.controller.ts
│   │   ├── user.controller.ts
│   │   └── treeUpdate.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── tree.routes.ts
│   │   ├── order.routes.ts
│   │   ├── adoption.routes.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.ts   - JWT verification
│   │   ├── admin.middleware.ts  - Admin role check
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── upload.middleware.ts
│   ├── utils/
│   │   ├── jwt.util.ts          - Token generation/verification
│   │   ├── password.util.ts     - Bcrypt helpers
│   │   ├── validator.util.ts    - Zod validation schemas
│   │   ├── response.util.ts     - Response formatting
│   │   └── ...
│   └── index.ts                 - Server entry point
├── prisma/
│   ├── schema.prisma            - Database schema
│   ├── migrations/              - Migration files
│   └── seed.ts                  - Database seeding
├── package.json
├── tsconfig.json
└── README.md
```

##  Setup & Development

### Prerequisites
- Node.js v18+
- PostgreSQL 13+
- npm or yarn

### Environment Variables

```bash
# Server
PORT=2000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pohonku_fkt

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:2000/api/v1/auth/google/callback

# Midtrans
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_SNAP_URL=https://app.sandbox.midtrans.com/snap/v1/transactions

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd pohonku/BE

# Install dependencies
npm install

# Setup database (PostgreSQL)
docker run -d \
  --name pohonku-fkt \
  -e POSTGRES_DB=pohonku_fkt \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=pohonku \
  -p 5433:5432 \
  postgres:15

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npm run prisma:seed

# Start development server
npm run dev
```

Server akan berjalan di `http://localhost:2000`

### Useful Commands

```bash
# Development
npm run dev                    # Start with nodemon

# Production
npm run build                  # Compile TypeScript
npm start                      # Run compiled JS

# Database
npx prisma studio            # Open Prisma UI
npx prisma migrate dev        # Create & run migration
npm run prisma:seed           # Seed database
```

##  Security Features

- ✅ **Password Hashing** - Bcryptjs dengan salt rounds
- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Role-Based Access Control** - USER & ADMIN roles
- ✅ **Input Validation** - Zod schema validation
- ✅ **CORS Protection** - Configured CORS headers
- ✅ **Error Handling** - Centralized error middleware
- ✅ **OAuth 2.0** - Secure Google OAuth integration

##  Performance Considerations

- **Database Indexing** - Optimized for common queries
- **Connection Pooling** - Prisma with PgBouncer compatible
- **Image Optimization** - Cloudinary for media delivery
- **Caching Ready** - Architecture supports Redis caching
- **Pagination** - Implemented untuk large datasets

##  Testing & Quality

- **TypeScript** - Full type safety
- **Input Validation** - Zod schemas untuk semua endpoints
- **Error Handling** - Structured error responses
- **Code Organization** - Separation of concerns (MVC pattern)

##  Learning Outcomes

Project ini mendemonstrasikan:

1. **Full-Stack Development**
   - Backend architecture design
   - RESTful API development
   - Database schema modeling

2. **Integration**
   - Third-party payment gateway (Midtrans)
   - OAuth 2.0 authentication
   - Cloud storage (Cloudinary)

3. **Security**
   - JWT token management
   - Password hashing & validation
   - Role-based access control

4. **Best Practices**
   - Modular code structure
   - Error handling & logging
   - Environment configuration
   - Database migrations

##  Role & Kontribusi

Sebagai developer backend, saya bertanggung jawab untuk:
- ✅ Merancang dan mengimplementasikan RESTful API endpoints
- ✅ Database design & Prisma ORM implementation
- ✅ Authentication system (JWT + Google OAuth)
- ✅ Payment gateway integration (Midtrans)
- ✅ Business logic & validation
- ✅ Error handling & middleware
- ✅ Deployment configuration




