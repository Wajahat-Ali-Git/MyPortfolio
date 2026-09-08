# Portfolio Backend API

Express.js backend with Supabase PostgreSQL database for portfolio contact form.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

Server runs at: `http://localhost:5000`

---

## 📁 Project Structure

```
Backend/
├── src/
│   └── index.js           # Main Express server
├── database/
│   ├── schema.sql         # PostgreSQL database schema
│   └── README.md          # Database documentation
├── .env                   # Environment variables (local only)
├── .env.example           # Example environment variables
├── .env.development       # Development config
├── .env.production        # Production config
├── .gitignore            # Git ignore rules
├── package.json          # Node.js dependencies
├── README.md             # This file
└── SETUP_CHECKLIST.md    # Step-by-step setup guide
```

---

## 🔌 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2026-09-08T...",
  "supabase": "connected"
}
```

---

### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I would like to discuss a project."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message received successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-09-08T12:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Missing required fields: name, email, and message are required"
}
```

---

### Get All Messages (Admin)
```http
GET /api/messages
X-API-Key: your_api_key_here
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "...",
      "created_at": "2026-09-08T12:00:00.000Z",
      "ip_address": "192.168.1.1",
      "user_agent": "Mozilla/5.0..."
    }
  ]
}
```

---

## ⚙️ Environment Variables

Create a `.env` file with:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Server
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Key (for admin endpoints)
API_KEY=your_secure_api_key_here
```

See `.env.example` for full configuration options.

---

## 🔒 Security Features

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Cross-Origin Resource Sharing protection
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **Input Validation** - Server-side validation for all inputs
- ✅ **Row Level Security** - Database-level access control
- ✅ **Service Role Key** - Backend-only database access
- ✅ **API Key Protection** - Admin endpoints require authentication

---

## 🧪 Testing

### Using cURL

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Submit Contact:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message."}'
```

**Get Messages (Admin):**
```bash
curl http://localhost:5000/api/messages \
  -H "X-API-Key: your_api_key_here"
```

### Using Postman

1. Import the collection (create from endpoints above)
2. Set environment variables
3. Test each endpoint

---

## 📦 Dependencies

### Production
- `express` - Web framework
- `@supabase/supabase-js` - Supabase client
- `cors` - CORS middleware
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `dotenv` - Environment variables

### Development
- `nodemon` - Auto-restart on file changes

---

## 🚀 Deployment

### Deploy to Render.com (Free)

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables from `.env.production`
7. Click **"Create Web Service"**

### Deploy to Railway.app

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`
5. Add environment variables: `railway variables set KEY=value`

---

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- ✅ Check `SUPABASE_URL` is correct
- ✅ Verify API keys are valid
- ✅ Ensure Supabase project is active

### "Port 5000 already in use"
- Change `PORT` in `.env` to another port

### "CORS error"
- Add your frontend URL to `CORS_ORIGIN` in `.env`

### "Rate limit exceeded"
- Wait 15 minutes or adjust `RATE_LIMIT_MAX_REQUESTS`

---

## 📚 Additional Documentation

- [Setup Checklist](./SETUP_CHECKLIST.md) - Complete setup guide
- [Database Documentation](./database/README.md) - Database schema and queries
- [Supabase Docs](https://supabase.com/docs) - Supabase documentation
- [Express.js Guide](https://expressjs.com) - Express.js documentation

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👤 Author

Wajahat Ali  
GitHub: [@Wajahat-Ali-Git](https://github.com/Wajahat-Ali-Git)

---

**Need help?** Open an issue or check the troubleshooting section above.
