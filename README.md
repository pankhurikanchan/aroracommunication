# ARORA COMMUNICATION 📱⚡
### Modern Full-Stack Mobile & Electronics E-Commerce Platform

A production-ready, full-stack Indian electronics e-commerce web platform for **Arora Communication**, architected for zero-to-low initial cost deployment using **Vercel Free Tier**, **Supabase PostgreSQL & Storage Free Tier**, and **GitHub**.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Architecture & Deployment Strategy](#-architecture--deployment-strategy)
4. [Live Features & Capabilities](#-live-features--capabilities)
5. [Local Development Setup](#-local-development-setup)
6. [Environment Variables](#-environment-variables)
7. [Supabase Setup (Database & Storage)](#-supabase-setup-database--storage)
8. [Database Schema & Migrations](#-database-schema--migrations)
9. [Supabase Image Storage](#-supabase-image-storage)
10. [Authentication & Authorization](#-authentication--authorization)
11. [Payment System](#-payment-system)
12. [GitHub Preparation](#-github-preparation)
13. [Vercel Deployment (Step-by-Step)](#-vercel-deployment)
14. [Free-Tier Cost Control & Limits](#-free-tier-cost-control--limits)
15. [Troubleshooting & FAQ](#-troubleshooting--faq)
16. [Custom Domain Setup](#-custom-domain-setup)

---

## 🌟 Project Overview

**Arora Communication** is an established electronics and mobile shop expanding to a modern digital storefront. The platform delivers an authentic Indian electronics e-commerce experience:
- **Pricing in Indian Rupees (`₹`)** with GST (18%) calculations and Free Delivery thresholds (over ₹999).
- **Indian Payment Options**: UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay, Visa, Mastercard, Net Banking (50+ Indian banks), and Cash on Delivery (COD).
- **Physical Store Grounding**: Retail shop address in Sector 18 Noida, Uttar Pradesh, official WhatsApp helpline, and courier tracking (Delhivery, BlueDart, DTDC).
- **Zero AWS Footprint**: Built to run entirely on **Vercel Free Tier** and **Supabase Free Tier** without EC2, RDS, NAT Gateways, or load balancers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, TypeScript, Tailwind CSS, React Router v7, Axios, Lucide Icons |
| **Backend** | Node.js (v24 LTS), Express.js, TypeScript, REST APIs, Helmet, CORS, Morgan |
| **Serverless Engine** | Vercel Serverless Functions (`@vercel/node`) |
| **Database** | PostgreSQL 16 (Supabase Free Tier) via Prisma ORM v6 (with SQLite dev fallback) |
| **Image Storage** | Supabase Storage Free Tier (`product-images` bucket via `@supabase/supabase-js`) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs password hashing (Customer & Admin roles) |
| **Payment System** | Cash on Delivery + Test/Demo mode (structured for drop-in Razorpay integration) |
| **Hosting & CI/CD** | Vercel (Frontend & Serverless API) + GitHub |

---

## 🏛️ Architecture & Deployment Strategy

```
                          ┌─────────────────────────────┐
                          │         End Users           │
                          └──────────────┬──────────────┘
                                         │
                                         ▼
            ┌────────────────────────────────────────────────────────┐
            │                   Vercel Free Tier                     │
            │                                                        │
            │  ┌───────────────────────┐  ┌───────────────────────┐  │
            │  │  Vite React Frontend  │  │  Express API Handler  │  │
            │  │      (Static SPA)     │  │ (Serverless Function) │  │
            │  └───────────┬───────────┘  └───────────┬───────────┘  │
            └──────────────┼──────────────────────────┼──────────────┘
                           │                          │
                           │                          │ (PgBouncer Pooler)
                           ▼                          ▼
            ┌────────────────────────────────────────────────────────┐
            │                  Supabase Free Tier                    │
            │                                                        │
            │  ┌───────────────────────┐  ┌───────────────────────┐  │
            │  │   Supabase Storage    │  │  PostgreSQL Database  │  │
            │  │   'product-images'    │  │     (Prisma ORM)      │  │
            │  └───────────────────────┘  └───────────────────────┘  │
            └────────────────────────────────────────────────────────┘
```

---

## 🚀 Live Features & Capabilities

### 🛍️ Customer Storefront
- **16 Electronics Categories**: Smartphones, iPhones, Android Phones, Tablets, Laptops, Smartwatches, Earphones, Headphones, Chargers, Power Banks, Cables, Mobile Covers, Screen Protectors, Speakers, Accessories, Electronics.
- **Dynamic Search & Filters**: Instant full-text search across title, description, brand, and category; price range slider (₹0–₹2,00,000); brand checklist; star rating filter; in-stock toggle.
- **Product Details**: Image carousel, RAM & Storage variant selector, specifications table, box contents, warranty info, customer reviews, verified purchase tags.
- **Cart & Wishlist**: Real-time quantity adjustments, active promotional coupons (`ARORA10`, `WELCOME500`), subtotal, GST, and delivery calculations.
- **5-Step Indian Checkout**: Customer info &rarr; Address with PIN &rarr; Order Summary &rarr; Payment Mode (UPI, Cards, Net Banking, COD) &rarr; Order Confirmation.
- **Customer Account**: Profile editing, order history with live status timeline (`Order Placed` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered`), and address book.

### 🛡️ Admin Suite (`/admin`)
- **Real-Time Analytics**: Total Revenue (₹), Total Orders, Total Customers, Low-Stock Inventory Warnings.
- **Product Management**: Add, update, delete products, manage RAM/Storage variants, and manage image gallery.
- **Image Upload & Storage**: Upload, replace, and delete images directly to/from Supabase Storage bucket `product-images`.
- **Order Fulfillment**: Update order status (`Processing`, `Shipped`, `Delivered`) and assign courier AWB numbers (Delhivery, BlueDart, DTDC).
- **Marketing & Taxonomy**: Create discount coupons, hero homepage banners, and product categories.

---

## 💻 Local Development Setup

### Prerequisites
- Node.js LTS (v18 or v20+ recommended, tested on v24 LTS)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/your-username/arora-communication.git
cd arora-communication

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
cd ..
```

### 2. Configure Local Environment
```bash
# In backend/
cp .env.example .env
```
*(By default, `.env` is pre-configured with SQLite `file:./dev.db` for instant offline testing without needing a local PostgreSQL server).*

### 3. Run Locally
You can run both backend and frontend concurrently:
```bash
# Terminal 1 - Backend API (Port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (Port 3000)
cd frontend
npm run dev
```

Visit **http://localhost:3000** in your browser!

### 🔑 Demo Credentials
- **Admin**: `admin@aroracommunication.com` / `Admin@123`
- **Customer**: `customer@example.com` / `Customer@123`
- **Coupons**: `ARORA10` (10% off), `WELCOME500` (₹500 off)

---

## ⚙️ Environment Variables

### Backend Environment Variables (`backend/.env` or Vercel)
| Variable | Description | Example / Note |
|---|---|---|
| `DATABASE_URL` | Supabase Transaction Pooler URL (Port 6543) | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Supabase Direct Connection URL (Port 5432) | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres` |
| `SUPABASE_URL` | Supabase Project API URL | `https://[REF].supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Anonymous Public Key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Keep secret!) | `eyJhbGciOi...` |
| `SUPABASE_STORAGE_BUCKET` | Image storage bucket | `product-images` |
| `PORT` | Local server port | `5000` |
| `NODE_ENV` | Environment mode | `production` (on Vercel) or `development` |
| `JWT_SECRET` | Secret key for signing user tokens | Strong 32+ character random string |
| `JWT_EXPIRES_IN` | Token duration | `7d` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `https://your-app.vercel.app` |
| `RAZORPAY_KEY_ID` | Optional payment key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Optional payment key secret | `...` |

### Frontend Environment Variables (`frontend/.env` or Vercel)
| Variable | Description | Example / Note |
|---|---|---|
| `VITE_API_URL` | Production URL to Backend API | `https://your-backend.vercel.app/api` (or relative `/api` if deployed together) |
| `VITE_STORE_NAME` | Display Store Name | `Arora Communication` |
| `VITE_RAZORPAY_KEY_ID` | Public Razorpay Key ID | `rzp_test_...` (Never put secret key here!) |

---

## 🗄️ Supabase Setup (Database & Storage)

### Step 1: Create Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in with GitHub.
2. Click **New Project**.
3. Set **Name**: `arora-communication`.
4. Choose a strong **Database Password** (save this!).
5. Select the closest Region (e.g. `ap-south-1` Mumbai for India).
6. Select **Free Plan** ($0/month) and click **Create new project**.

### Step 2: Retrieve Database Connection Strings
1. In the Supabase sidebar, click the **Settings (gear icon)** &rarr; **Database**.
2. Scroll to **Connection string**:
   - Under **URI**, switch the tab to **Transaction** (Port `6543`).
   - Copy this string as your **`DATABASE_URL`**. Remember to append `?pgbouncer=true` if not already present.
   - Switch the tab to **Session** or **Direct** (Port `5432`).
   - Copy this string as your **`DIRECT_URL`**.
   - Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

### Step 3: Create Storage Bucket
1. In the Supabase sidebar, click **Storage**.
2. Click **New bucket**.
3. Name: `product-images`.
4. Turn **ON** the toggle: **"Public bucket"** (so uploaded product images can be viewed publicly by shoppers).
5. Click **Save**.

### Step 4: Retrieve API Keys
1. Go to **Settings** &rarr; **API**.
2. Copy:
   - **Project URL** &rarr; `SUPABASE_URL`
   - **anon public** key &rarr; `SUPABASE_ANON_KEY`
   - **service_role secret** key &rarr; `SUPABASE_SERVICE_ROLE_KEY`

---

## 📦 Database Schema & Migrations

The database models are defined in `backend/prisma/schema.prisma` covering:
- `User` (Customer & Admin)
- `Category` (16 Indian electronics categories)
- `Brand` (Apple, Samsung, OnePlus, boAt, Sony, etc.)
- `Product` (Price, discount, stock, SKU, specs, warranty)
- `ProductImage` (Supabase Storage URLs)
- `ProductVariant` (RAM, Storage, Color)
- `Cart` & `CartItem`
- `Wishlist` & `WishlistItem`
- `Address` (Indian PIN codes, states)
- `Order` & `OrderItem`
- `Payment` (UPI, Cards, Net Banking, COD)
- `Coupon` (Percentage / Flat discounts)
- `Review` (Ratings, verified purchase tags)
- `Banner` (Homepage hero slides)

### Pushing Schema & Seeding to Supabase:
From your local terminal:
```bash
cd backend

# Set your Supabase connection string temporarily or in backend/.env:
# DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Push schema to Supabase:
npm run db:push

# Seed with 31 realistic products, categories, coupons, and admin account:
npm run db:seed
```

---

## 🖼️ Supabase Image Storage

Product images uploaded through the Admin panel are handled by `backend/src/services/supabaseStorage.ts`:
- Uploads memory buffers directly to the `product-images` bucket.
- Automatically generates permanent public URLs (`https://[PROJECT-REF].supabase.co/storage/v1/object/public/product-images/...`).
- Safe deletion and replacement endpoints ensure stale image files do not clutter the bucket.
- Images are never stored on ephemeral Vercel filesystems.

---

## 🔒 Authentication & Authorization

- **Password Hashing**: Uses `bcryptjs` with 10 salt rounds. Plaintext passwords and hashes are never exposed in API responses.
- **JWT Protection**: Tokens signed with `JWT_SECRET` and evaluated by `authenticateToken` middleware.
- **Role Enforcement**: Protected routes check `req.user.role === 'ADMIN'` with `requireAdmin` middleware.
- **Session Persistence**: Stored securely in `localStorage` on the frontend with automatic 401 token expiry handling.

---

## 💳 Payment System

The application comes pre-configured with:
1. **Cash on Delivery (COD)**: Fully functional without third-party gateways.
2. **Test / Demo Indian Payment Mode**: Simulates instant UPI (Google Pay / PhonePe) and Net Banking confirmations with live order generation.
3. **Razorpay Readiness**: `paymentController.ts` includes HMAC SHA256 signature verification code and order creation endpoints. When ready for live payments, simply enter real Razorpay credentials in environment variables without altering the frontend checkout code!
4. **Security**: Never stores raw card numbers, CVVs, or UPI PINs.

---

## 🐙 GitHub Preparation

1. Verify `.gitignore` prevents secrets, `.env`, `node_modules`, and `dist` from being tracked.
2. Initialize repository and commit:
```bash
git init
git add .
git commit -m "feat: complete production-ready full-stack Arora Communication e-commerce"
git branch -M main
git remote add origin https://github.com/your-username/arora-communication.git
git push -u origin main
```

---

## ▲ Vercel Deployment

For maximum flexibility, the project supports both **Individual Project Deployment (Recommended)** and **Unified Monorepo Deployment**.

### Recommended Method: Two Free Vercel Projects

#### 1. Deploy the Backend API:
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** &rarr; **Project**.
3. Import your `arora-communication` GitHub repository.
4. In **Project Settings**:
   - **Project Name**: `arora-communication-backend`
   - **Root Directory**: Click *Edit* and select **`backend`**.
   - **Framework Preset**: *Other*
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave default.
5. In **Environment Variables**, add:
   - `DATABASE_URL` (Supabase transaction pooler URL)
   - `DIRECT_URL` (Supabase direct connection URL)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET`: `product-images`
   - `JWT_SECRET`: (your secure 32-character string)
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://arora-communication.vercel.app` (or `*`)
6. Click **Deploy**.
7. Note down your backend URL (e.g. `https://arora-communication-backend.vercel.app`). Test `https://your-backend.vercel.app/api/health` to confirm `status: "healthy"`.

#### 2. Deploy the Frontend Storefront:
1. In Vercel, click **Add New...** &rarr; **Project**.
2. Select the same GitHub repository.
3. In **Project Settings**:
   - **Project Name**: `arora-communication`
   - **Root Directory**: Click *Edit* and select **`frontend`**.
   - **Framework Preset**: **Vite**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://arora-communication-backend.vercel.app/api`
   - `VITE_STORE_NAME`: `Arora Communication`
5. Click **Deploy**.
6. Visit your live store URL!

---

## 💰 Free-Tier Cost Control & Limits

| Service | Free Tier Allowance | Our Usage & Safeguards | Potential Risk & How to Avoid |
|---|---|---|---|
| **Vercel** | 100 GB Bandwidth/mo, 100 GB-hrs Serverless Execution, 1M invocations | Frontend is statically cached on Vercel's global Edge CDN. API functions are lightweight Express handlers. | If limits are reached, Vercel throttles or pauses until the next billing cycle. No surprise charges. |
| **Supabase DB** | 500 MB Database Storage, Shared CPU / 500 MB RAM | 31 seeded products + orders take ~2 MB (< 1% of free allowance). | Inactive projects pause after 7 days of inactivity. Simply ping `/api/health` or log into Supabase dashboard to resume. |
| **Supabase Storage** | 1 GB File Storage, 2 GB Bandwidth/mo | Multer strictly caps uploads at 5 MB and optimizes image dimensions. | Exceeding 1 GB stops new uploads. Monitor bucket size in Supabase Storage dashboard. |
| **GitHub** | Unlimited public/private repositories, 2,000 CI Actions mins/mo | Standard repository storage. | Stay within standard repo size (< 1 GB) by keeping binaries out of Git. |

---

## 🔍 Troubleshooting & FAQ

### 1. `Cannot GET /products` or 404 on refresh on Vercel
- **Cause**: Client-side single-page app (SPA) routing requires routing all requests back to `/index.html`.
- **Solution**: `frontend/vercel.json` contains the rewrite rule `{ "source": "/(.*)", "destination": "/index.html" }` which handles this automatically.

### 2. Prisma: "the URL must start with postgresql:// or postgres://"
- **Cause**: Prisma was generated for PostgreSQL while `DATABASE_URL` pointed to `file:./dev.db`.
- **Solution**: The included `node scripts/generate.js` script automatically inspects your `DATABASE_URL` in `.env` and selects the correct schema (`schema.prisma` for Supabase PostgreSQL, `schema.sqlite.prisma` for local offline dev).

### 3. Supabase: "Can't reach database server at ...:5432"
- **Cause**: IPv6 connectivity or running on serverless without connection pooling.
- **Solution**: Use the **Transaction Pooler URL** (port `6543` with `?pgbouncer=true`) for `DATABASE_URL` and the session URL (port `5432`) for `DIRECT_URL`.

### 4. CORS error in browser console
- **Cause**: Backend does not allow the frontend domain.
- **Solution**: `backend/src/app.ts` includes dynamic origin matching that automatically permits all `*.vercel.app` preview and production URLs!

---

## 🌐 Custom Domain Setup

When you are ready to link a custom domain (e.g. `aroracommunication.com`):
1. In Vercel, open your frontend project &rarr; **Settings** &rarr; **Domains**.
2. Enter your custom domain name (e.g. `aroracommunication.com` and `www.aroracommunication.com`).
3. Add the displayed DNS records (CNAME and A record) at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Vercel automatically provisions a free SSL certificate within minutes!
5. In your backend project environment variables, update `CLIENT_URL` to `https://aroracommunication.com`.
