# Backend Setup Checklist

Complete guide to set up your Portfolio Backend API with Supabase integration.

---

## 📋 Prerequisites

- [x] Node.js installed (v16 or higher)
- [x] npm or yarn package manager
- [ ] Supabase account created
- [ ] Git installed

---

## 🚀 Step-by-Step Setup

### 1. Install Dependencies

```bash
cd Backend
npm install
```

**Expected output:** All dependencies installed successfully.

---

### 2. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in the details:
   - **Name:** Portfolio Backend (or your preferred name)
   - **Database Password:** Choose a strong password (save this!)
   - **Region:** Select closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup to complete

---

### 3. Get Supabase Credentials

Once your project is created:

1. In the Supabase dashboard, go to **Settings** → **API**
2. You'll find these credentials:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGc...`)
   - **service_role** key (starts with `eyJhbGc...`)
3. Keep these safe - you'll need them in the next step

---

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `Backend/.env` in your editor

3. Replace the placeholder values with your actual credentials:

   ```env
   # Supabase Configuration
   SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...your-actual-anon-key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-actual-service-role-key

   # Server Configuration
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3001
   ```

4. **Important:** Keep `NODE_ENV=development` during local development

---

### 5. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `Backend/database/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"**

**Expected output:** "Success. No rows returned"

This creates:
- `contact_messages` table
- Row Level Security (RLS) policies
- Indexes for performance

---

### 6. Verify Database Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the `contact_messages` table
3. Click on it to view the structure:
   - `id` (uuid, primary key)
   - `name` (text)
   - `email` (text)
   - `message` (text)
   - `created_at` (timestamp)
   - `ip_address` (text, optional)
   - `user_agent` (text, optional)

---

### 7. Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
=====================================
  Portfolio Backend API
=====================================
  Environment: development
  Port: 5000
  URL: http://localhost:5000
=====================================
```

---

### 8. Test the API

**Test 1: Health Check**
```bash
curl http://localhost:5000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2026-09-08T..."
}
```

**Test 2: Submit Contact Form**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello from the API!"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Message received successfully",
  "data": {
    "id": "...",
    "created_at": "..."
  }
}
```

**Test 3: Verify in Supabase**
1. Go to Supabase **Table Editor**
2. Click `contact_messages`
3. You should see your test message!

---

## ✅ Setup Complete!

Your backend is now running and connected to Supabase. You can:

- ✅ Accept contact form submissions
- ✅ Store messages securely in PostgreSQL
- ✅ Query messages via admin endpoint
- ✅ Protected by rate limiting and CORS

---

## 🔐 Security Checklist

- [ ] `.env` file is in `.gitignore` (✅ Already configured)
- [ ] Never commit `.env` to git
- [ ] Use different credentials for production
- [ ] Enable Supabase RLS policies (✅ Already enabled)
- [ ] Regenerate keys if accidentally exposed

---

## 📝 Next Steps

### Option 1: Create Frontend Contact Form
Integrate this API with your Next.js portfolio to create a working contact form.

### Option 2: Deploy to Production
Deploy your backend to a hosting service:
- Render.com (Free tier available)
- Railway.app
- Heroku
- AWS/GCP/Azure

### Option 3: Add More Features
- Email notifications (SendGrid, Mailgun)
- Admin dashboard to view messages
- Spam protection (Google reCAPTCHA)
- File upload support

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Supabase"
- ✅ Check your `SUPABASE_URL` is correct
- ✅ Verify `SUPABASE_ANON_KEY` or `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Ensure your Supabase project is active

### Issue: "Port 5000 already in use"
- Change `PORT=5000` to another port in `.env` (e.g., `PORT=5001`)

### Issue: "CORS error from frontend"
- Update `CLIENT_URL` in `.env` to match your frontend URL
- Default: `http://localhost:3001`

### Issue: "Rate limit exceeded"
- Wait 1 minute and try again
- Rate limit: 100 requests per 15 minutes per IP

### Issue: "Database insert failed"
- Check the SQL schema was executed correctly
- Verify RLS policies are in place
- Check Supabase logs for errors

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the [Backend README.md](./README.md)
2. Review [Database README](./database/README.md)
3. Check Supabase logs in the dashboard
4. Review server logs in your terminal

---

**Happy coding! 🚀**
