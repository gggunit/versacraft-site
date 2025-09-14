# 🎯 VersaCraft Booking System Setup Guide

Your custom Google Calendar booking system is ready! This replaces Calendly with a professional, integrated solution that connects directly to your Google Calendar.

## ✅ What's Included

- **Real-time Google Calendar integration** - Shows your actual availability
- **Smart conflict prevention** - Automatically blocks busy times  
- **Professional booking flow** - Clean, mobile-responsive interface
- **Email confirmations** - Automated notifications for both parties
- **Calendar event creation** - Adds bookings directly to your Google Calendar

## 🚀 Quick Setup (15 minutes)

### Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/germangladkov/Downloads/versacraft-site
npm install
```

### Step 2: Google Calendar API Setup (8 minutes)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** (or select existing):
   - Name: `VersaCraft Scheduler`
3. **Enable Google Calendar API**:
   - Go to "APIs & Services" → "Library"
   - Search "Google Calendar API" → Enable
4. **Create OAuth Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth Client ID"
   - Application type: "Web application"
   - Name: "VersaCraft Booking"
   - Authorized origins: `http://localhost:3000` and your domain
   - Copy the **Client ID** and **Client Secret**
5. **Create API Key**:
   - Click "Create Credentials" → "API Key"
   - Copy the **API Key**

### Step 3: Email Service Setup (3 minutes)

Choose one option:

**Option A: Resend (Recommended)**
1. Go to https://resend.com/
2. Sign up with your email
3. Create API Key → Copy it (starts with `re_`)

**Option B: Gmail SMTP (Free)**
1. Enable 2-factor authentication on your Google account
2. Generate an "App Password" for Gmail
3. Use your Gmail address and app password

### Step 4: Environment Configuration (2 minutes)

1. **Copy the environment template**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** with your credentials:
   ```bash
   GOOGLE_CLIENT_ID=your_actual_client_id
   GOOGLE_CLIENT_SECRET=your_actual_client_secret  
   GOOGLE_API_KEY=your_actual_api_key
   RESEND_API_KEY=re_your_actual_resend_key
   BUSINESS_EMAIL=german.gladkov@gmail.com
   ```

### Step 5: Test & Launch

```bash
npm run dev
```

Visit: http://localhost:3000/availability

## 🎯 How It Works

### For Your Clients:
1. **Visit your booking page** → Clean, professional interface
2. **Select date** → Only shows available days (Mon-Fri)
3. **Choose time** → Real-time check against your Google Calendar
4. **Fill details** → Name, email, service type, notes
5. **Confirm** → Instant booking with email confirmation

### For You:
1. **Calendar sync** → Bookings appear in your Google Calendar immediately
2. **Email notifications** → Get notified of every new booking
3. **Client details** → All information included in calendar event
4. **No double-booking** → System checks your real availability

## 📂 Files Updated

- `components/CalendarEmbed.tsx` - Modern booking interface
- `lib/google-calendar.ts` - Google Calendar integration
- `app/api/availability/route.ts` - Availability checking API
- `app/api/book/route.ts` - Booking creation API
- `package.json` - Added required dependencies

## 🔧 Next Steps (Optional)

1. **Deploy to Vercel**:
   ```bash
   npm run build
   # Deploy via Vercel dashboard or CLI
   ```

2. **Custom Domain**: Add your domain in Vercel settings

3. **Enhanced Features**:
   - Payment integration (Stripe)
   - SMS reminders (Twilio)
   - Zoom meeting auto-generation
   - Client rescheduling portal

## 🛡️ Production Configuration

When deploying to production:

1. **Update OAuth Origins** in Google Cloud Console:
   - Add your production domain: `https://versacraft.com`

2. **Environment Variables** in Vercel:
   - Add all .env.local variables to Vercel dashboard
   - Set `NODE_ENV=production`
   - Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`

## 📞 Support

The system includes proper error handling and fallbacks. If you encounter issues:

1. Check the browser console for errors
2. Verify API credentials are correct
3. Ensure Google Calendar API is enabled
4. Test with a simple booking first

Your booking system is now **production-ready** and will provide a much better client experience than Calendly while being fully integrated with your workflow!
