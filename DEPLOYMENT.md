# Deploy to Vercel - Step by Step Guide

## Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Create a Vercel account at vercel.com
3. Have your environment variables ready

## Deployment Steps

### Option 1: Using Vercel CLI (Recommended)

1. **Login to Vercel**

   ```bash
   vercel login
   ```

2. **Deploy from your project directory**

   ```bash
   vercel
   ```

   Follow the prompts:

   - Set up and deploy? → Y
   - Which scope? → Choose your account
   - Link to existing project? → N
   - Project name → (accept default or customize)
   - Directory → ./
   - Override settings? → N

3. **Set Environment Variables**

   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
   vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
   vercel env add OPENROUTER_API_KEY
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Import Project"
3. Import from Git repository or upload folder
4. Configure build settings (usually auto-detected)
5. Add environment variables in project settings
6. Deploy

## Environment Variables to Add in Vercel

Copy these from your .env.local file:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `OPENROUTER_API_KEY`

## Firebase Security Rules

Make sure your Firebase rules allow your domain:

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to authorized domains
3. Update Firestore rules if needed

## Post-Deployment

1. Test all functionality on the live site
2. Update any hardcoded localhost URLs
3. Monitor for any CORS or API issues

## Troubleshooting

- If build fails, check the Vercel build logs
- Ensure all environment variables are set
- Check Firebase security settings
- Verify API routes work in production
