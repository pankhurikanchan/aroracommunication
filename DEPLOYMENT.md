# 🚀 ARORA COMMUNICATION — COMPLETE STEP-BY-STEP DEPLOYMENT GUIDE

This guide walks you through deploying **Arora Communication** to the public internet using 100% free-tier services:
- **Frontend & Backend API**: Vercel Free (Hobby) Tier
- **Database & Image Storage**: Supabase Free Tier
- **Version Control**: GitHub Free

---

## 📋 PRE-FLIGHT CHECKLIST

Before beginning, ensure you have:
1. A **GitHub account** ([github.com](https://github.com))
2. A **Supabase account** ([supabase.com](https://supabase.com) — free sign up with GitHub)
3. A **Vercel account** ([vercel.com](https://vercel.com) — free sign up with GitHub)

---

## STEP 1 — Create GitHub Repository

1. Open your browser and navigate to [https://github.com/new](https://github.com/new).
2. Set the **Repository name**: `arora-communication`.
3. Choose **Public** or **Private** (both are free on GitHub).
4. **DO NOT** check "Add a README file", "Add .gitignore", or "Choose a license" (our project already contains customized versions of these).
5. Click the green button: **Create repository**.
6. Leave the GitHub page open — you will need the repository URL (e.g., `https://github.com/your-username/arora-communication.git`).

---

## STEP 2 — Push Existing Project to GitHub

Open PowerShell or Command Prompt on your computer, navigate to the project directory, and run the following commands:

```powershell
# Navigate to the project root directory
cd "C:\Users\Pankhuri Kanchal\.gemini\antigravity\scratch\aurora-communication"

# Initialize Git repository (if not already initialized)
git init

# Stage all files (our .gitignore automatically excludes node_modules and .env)
git add .

# Create the initial commit
git commit -m "feat: complete production-ready full-stack Arora Communication e-commerce"

# Rename current branch to main
git branch -M main

# Link your local repo to GitHub (replace with your actual GitHub URL from Step 1)
git remote add origin https://github.com/your-username/arora-communication.git

# Push code to GitHub
git push -u origin main
```

*(If prompted by GitHub for login, sign in with your GitHub credentials or Personal Access Token).*

---

## STEP 3 — Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (Sign in with your GitHub account).
2. Click **New Project** (or select your organization).
3. Fill in the project details:
   - **Name**: `arora-communication`
   - **Database Password**: Choose a strong password and **write it down** (e.g. `AroraComm@2026!Db`). You will need this in Step 4.
   - **Region**: Choose the region closest to your customers (e.g. `ap-south-1` **Mumbai** for India, or `us-east-1`).
   - **Pricing Plan**: Choose **Free Plan ($0/month)**.
4. Click **Create new project**.
5. Wait 1–2 minutes while Supabase sets up your PostgreSQL database cluster.

---

## STEP 4 — Configure Database (Connection Strings & Migrations)

### 4.1 Copy Connection Strings from Supabase
1. In your Supabase project dashboard, click the **Project Settings** (gear icon at the bottom of the left sidebar).
2. Click **Database** under Configuration.
3. Scroll down to the **Connection string** section.
4. Click the **URI** tab:
   - Click the **Transaction** sub-tab (uses port `6543`).
   - Copy this connection string. It will look like:
     ```
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - Replace `[YOUR-PASSWORD]` with the password you created in Step 3. This is your **`DATABASE_URL`**.
   - Now click the **Session** (or Direct) sub-tab (uses port `5432`).
   - Copy this connection string:
     ```
     postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your password. This is your **`DIRECT_URL`**.

### 4.2 Push Schema & Seed Initial Data to Supabase
Run the following commands on your local machine to create all 16 tables and seed 31 realistic Indian electronics products into your Supabase database:

```powershell
cd "C:\Users\Pankhuri Kanchal\.gemini\antigravity\scratch\aurora-communication\backend"

# Set your Supabase connection strings in your PowerShell session
$env:DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
$env:DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Push the Prisma schema directly to your Supabase PostgreSQL database
npx prisma db push --schema=prisma/schema.prisma

# Seed the database with 31 products, categories, coupons, and admin account
npx ts-node prisma/seed.ts
```

*(You will see output confirming: "Database is now in sync with the Prisma schema" and "Seeding finished. 31 products, 16 categories created!").*

---

## STEP 5 — Configure Storage (Image Bucket)

1. In the Supabase left sidebar, click the **Storage** icon (folder icon).
2. Click the green button: **New bucket**.
3. In the modal:
   - **Name**: `product-images` (type exactly this name in lowercase with a hyphen).
   - Turn **ON** the switch: **Public bucket** (this allows product images to be viewed publicly on your website).
4. Click **Save**.

### 5.1 Copy Supabase API Keys
1. In the Supabase left sidebar, click **Project Settings** &rarr; **API**.
2. Copy the following three values to a notepad:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`) &rarr; This is your `SUPABASE_URL`.
   - **Project API keys &rarr; `anon` `public`** &rarr; This is your `SUPABASE_ANON_KEY`.
   - **Project API keys &rarr; `service_role` `secret`** &rarr; This is your `SUPABASE_SERVICE_ROLE_KEY`.

---

## STEP 6 — Configure Local Environment Variables (Optional Backup)

In your local `backend/.env` file, you can optionally paste the Supabase URLs to connect your local server to Supabase:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
SUPABASE_STORAGE_BUCKET="product-images"
JWT_SECRET="arora_secure_random_jwt_secret_2026"
CLIENT_URL="http://localhost:3000"
```

---

## STEP 7 — Create & Connect Vercel Project

We will deploy in two streamlined steps: first the **Backend API**, then the **Frontend Storefront**.

### 7.1 Deploy the Backend API First
1. Log in to [https://vercel.com](https://vercel.com) using your GitHub account.
2. In your Vercel Dashboard, click the **Add New...** button in the top right &rarr; select **Project**.
3. Under **Import Git Repository**, find `arora-communication` and click **Import**.
4. In the configuration screen:
   - **Project Name**: `arora-communication-backend`
   - **Framework Preset**: Leave as *Other*.
   - **Root Directory**: Click the **Edit** button next to Root Directory, select the **`backend`** folder, and click **Continue**.
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave empty/default.
5. Expand the **Environment Variables** accordion and add the variables from Step 8.1 below.
6. Click **Deploy**.
7. Wait ~60 seconds. Once deployed, Vercel will show congratulations and provide your live API domain (e.g., `https://arora-communication-backend.vercel.app`).
8. Copy this backend URL!

---

## STEP 8 — Configure Vercel Environment Variables

### 8.1 Backend Project Environment Variables (in `arora-communication-backend`)
Add these in Vercel project **Settings** &rarr; **Environment Variables**:

| Key | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres` |
| `SUPABASE_URL` | `https://[YOUR-PROJECT-REF].supabase.co` |
| `SUPABASE_ANON_KEY` | *(Your Supabase anon key)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Your Supabase service_role key)* |
| `SUPABASE_STORAGE_BUCKET` | `product-images` |
| `JWT_SECRET` | `arora_super_jwt_secret_production_2026_xyz` *(Any 32+ character random string)* |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `*` *(Or your frontend Vercel URL once created)* |

Click **Save** for each variable.

---

### 8.2 Frontend Project Environment Variables (in `arora-communication`)
1. Return to your Vercel Dashboard &rarr; Click **Add New...** &rarr; **Project**.
2. Select the same `arora-communication` GitHub repository and click **Import**.
3. In the configuration screen:
   - **Project Name**: `arora-communication`
   - **Framework Preset**: **Vite** (Vercel will usually auto-detect this).
   - **Root Directory**: Click **Edit**, select the **`frontend`** folder, and click **Continue**.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://arora-communication-backend.vercel.app/api` *(Your backend URL from Step 7.1 + `/api`)* |
| `VITE_STORE_NAME` | `Arora Communication` |

5. Click **Deploy**.

---

## STEP 9 — Deploy

1. Vercel will build the frontend with Vite, compile TypeScript, and publish to its global Edge network.
2. In about 45–60 seconds, you will see confetti and a screenshot preview of your store!
3. Click the preview or the **Visit** button to open your live production website (e.g. `https://arora-communication.vercel.app`).

---

## STEP 10 — Test Live Website

Verify that everything works on the live internet:

1. **Homepage Check**:
   - Open your live Vercel URL.
   - Confirm **Arora Communication** logo and name appear in header and footer.
   - Confirm the 16 categories and products appear on the homepage.
2. **Catalog & Filters**:
   - Click **Products** in navigation.
   - Test the search bar (e.g., search "iPhone" or "boAt").
   - Move the price slider and toggle the "In Stock" filter.
3. **Product Details & Cart**:
   - Click on any product (e.g. *iPhone 16 Pro Max* or *OnePlus 13*).
   - Switch color and storage variants.
   - Click **Add to Cart**.
   - Open Cart &rarr; Apply coupon **`ARORA10`** &rarr; verify the 10% discount is applied.
4. **Checkout Flow**:
   - Click **Proceed to Checkout**.
   - Enter your delivery address.
   - Select **Cash on Delivery (COD)** or **Test UPI / Card**.
   - Click **Place Order**. Confirm the order success screen and order number (`ARC-2026-...`) appear!
5. **Admin Suite**:
   - Navigate to `/login`.
   - Click **1-Click Demo Admin** (or log in with `admin@aroracommunication.com` / `Admin@123`).
   - Navigate to `/admin`.
   - Verify Total Revenue, Orders count, and Products count.
   - Go to **Orders** &rarr; Click **Status** on the test order &rarr; update to `Processing` or `Shipped` and enter tracking number `DELHIVERY-123456`.
   - Go to **Products** &rarr; Click **Add Product** &rarr; Test uploading an image to Supabase Storage.

---

## STEP 11 — Check Logs & Diagnostics

### Viewing Backend Serverless Logs in Vercel:
1. In Vercel, open your `arora-communication-backend` project.
2. Click the **Logs** tab in the top navigation bar.
3. You will see real-time HTTP requests, status codes (`200 OK`, `201 Created`), and execution runtimes.
4. If an API request ever fails, the exact stack trace appears here.

### Viewing Supabase Database Queries & Health:
1. In Supabase, open your project dashboard.
2. Click **Database** &rarr; **Roles / Query Performance**.
3. Click **Table Editor** to view rows in `users`, `products`, `orders`, and `reviews` in real-time as customers place orders.

---

## STEP 12 — Check Free-Tier Usage & Quotas

To ensure your application stays completely free forever:

### 12.1 Vercel Quota Check:
1. In Vercel, click your profile avatar in the top right &rarr; **Settings** &rarr; **Usage**.
2. Check:
   - **Bandwidth**: (100 GB allowance per month — typical e-commerce store uses 2–5 GB).
   - **Serverless Function Execution**: (100 GB-hours allowance).
   - **Edge Invocations**: (1,000,000 requests per month).

### 12.2 Supabase Quota Check:
1. In Supabase, click **Settings** (gear icon) &rarr; **Usage**.
2. Check:
   - **Database Space**: 500 MB limit (our 31 seeded products and initial orders take < 2 MB, meaning you have 99% of free database space remaining).
   - **Storage Bucket**: 1 GB limit for `product-images`.
3. **Inactivity Safeguard**: Free Supabase projects pause after 7 days if no database queries occur. To prevent this, simply visit your website once a week, or set up a free 5-minute ping on [uptimerobot.com](https://uptimerobot.com) pointing to your backend URL: `https://arora-communication-backend.vercel.app/api/health`.

---

## STEP 13 — Add a Custom Domain (When Ready)

When you decide to purchase a domain (e.g., `aroracommunication.com` or `aroracommunication.in`):

1. Go to your domain registrar (GoDaddy, Namecheap, Google Domains/Squarespace, etc.).
2. In Vercel, open your frontend project `arora-communication` &rarr; **Settings** &rarr; **Domains**.
3. Type your domain: `aroracommunication.com` and click **Add**.
4. Vercel will give you two DNS records:
   - **A Record**: `@` &rarr; `76.76.21.21`
   - **CNAME Record**: `www` &rarr; `cname.vercel-dns.com`
5. Add these records in your domain registrar's DNS management panel.
6. Within 15 minutes, Vercel will automatically verify DNS and issue a free SSL/TLS certificate!
7. Update `CLIENT_URL` in your backend Vercel project settings to `https://aroracommunication.com`.

---

🎉 **Congratulations! Your Arora Communication website is now live, secure, and operating within 100% free-tier limits!**
