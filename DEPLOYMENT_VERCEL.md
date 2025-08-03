# FOIA Tracker - Vercel Deployment Guide

## Quick Deployment Steps

### 1. **Get a Cloud Database (Required)**

**Option A: Supabase (Recommended - Free tier available)**
1. Go to [supabase.com](https://supabase.com)
2. Create a new account and project
3. Go to Settings → Database
4. Copy the "Connection string" (URI format)
5. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`

**Option B: Neon (Alternative)**
1. Go to [neon.tech](https://neon.tech)
2. Create account and database
3. Copy the connection string

### 2. **Deploy to Vercel**

**Method 1: Connect GitHub Repository**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Connect your GitHub repo
5. Vercel will auto-detect Next.js settings

**Method 2: Vercel CLI**
```bash
npm install -g vercel
vercel
```

### 3. **Configure Environment Variables**

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL = your_database_connection_string_from_step_1
UPLOAD_DIR = ./public/uploads
```

### 4. **Set Up Database Schema**

After deployment, run database setup:

**Option A: Using Vercel CLI**
```bash
vercel env pull .env.local
npx prisma db push
npx tsx prisma/full-seed.ts
```

**Option B: Using your database provider's console**
- Copy the SQL schema from Prisma and run it directly

### 5. **Test Your Deployment**

1. Visit your Vercel URL
2. Test uploading a case
3. Verify all 50 states are visible
4. Check that the Applied Database works

## What You Need to Provide:

1. **Database Connection String** - From Supabase/Neon
2. **GitHub Repository** (optional but recommended)
3. **Vercel Account** (free)

## Team Access:

Once deployed:
1. Share the Vercel URL with your team
2. Everyone can use the same online database
3. All cases will be centralized

## Troubleshooting:

**Database Connection Issues:**
- Make sure your database allows connections from `0.0.0.0/0`
- Check if your connection string includes the correct password

**Build Failures:**
- Ensure all environment variables are set
- Check the Vercel build logs

**Missing Data:**
- Run the seed script to populate all 50 states
- Verify DATABASE_URL is correctly set

## Cost Estimate:
- **Vercel**: Free tier (should be sufficient)
- **Supabase**: Free tier includes 500MB database
- **Total**: $0/month for small teams

Your FOIA tracker will be live and accessible to your entire team!