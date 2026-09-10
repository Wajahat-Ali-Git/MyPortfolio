# Portfolio Backend API Documentation

## 🚀 Overview

Complete REST API for portfolio content management with multi-language support (EN, UR, HI, AR, FR, DE).

**Base URL:** `http://localhost:5000`  
**Version:** 2.0.0  
**Database:** PostgreSQL (Supabase Local)

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Projects](#projects)
  - [Experiences](#experiences)
  - [Skills](#skills)
  - [Certifications](#certifications)
  - [Profile](#profile)
  - [Tools](#tools)
  - [GitHub](#github)
- [Multi-Language Support](#multi-language-support)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## 🏁 Getting Started

### Prerequisites

- Node.js v20+
- PostgreSQL 16 (via Docker or Supabase)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment
npm run setup
# OR manually create .env file

# Run migrations
npm run migrate:portfolio

# Seed database
npm run seed

# Start development server
npm run dev
```

### Quick Commands

```bash
npm run dev              # Start development server
npm run migrate:portfolio # Run database migrations
npm run seed             # Populate with sample data
npm run db:fresh         # Reset and seed database
npm test-db              # Test database connection
node test-api-endpoints.js # Test all API endpoints
```

---

## 🔐 Authentication

Admin endpoints require API key authentication.

**Header:**
```
X-API-Key: your_api_key_here
```

**Configure in `.env`:**
```env
API_KEY=your_secure_api_key
```

**Protected Endpoints:**
- POST, PUT, DELETE operations
- All create/update/delete routes

---

## 📡 API Endpoints

### Core

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "environment": "development",
  "timestamp": "2026-09-09T10:44:15.510Z",
  "database": "PostgreSQL"
}
```

#### API Info
```http
GET /
```

**Response:**
```json
{
  "message": "Portfolio Backend API",
  "version": "2.0.0",
  "endpoints": { ... }
}
```

---

### Projects

#### Get All Projects
```http
GET /api/projects
GET /api/projects?lang=ur
```

**Query Parameters:**
- `lang` (optional): Language code (en, ur, hi, ar, fr, de)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "CARSAGE",
      "slug": "carsage",
      "description": "...",
      "github_url": "https://github.com/...",
      "live_url": null,
      "featured": true,
      "status": "completed",
      "color": "purple",
      "tech_stack": ["React Native", "Expo", "Firebase"],
      "created_at": "2026-09-09T...",
      "updated_at": "2026-09-09T..."
    }
  ]
}
```

#### Get Featured Projects
```http
GET /api/projects/featured
```

#### Get Project by Slug
```http
GET /api/projects/:slug
```

**Example:**
```http
GET /api/projects/carsage
```

#### Create Project (Admin)
```http
POST /api/projects
X-API-Key: your_api_key
Content-Type: application/json
```

**Body:**
```json
{
  "title": "My Project",
  "slug": "my-project",
  "description": "Project description",
  "github_url": "https://github.com/...",
  "tech_stack": ["React", "Node.js"],
  "featured": false,
  "color": "blue",
  "status": "in_progress"
}
```

#### Update Project (Admin)
```http
PUT /api/projects/:id
X-API-Key: your_api_key
```

#### Delete Project (Admin)
```http
DELETE /api/projects/:id
X-API-Key: your_api_key
```

---

### Experiences

#### Get All Experiences
```http
GET /api/experiences
GET /api/experiences?lang=hi
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company_name": "CMIT Internship Program, Lahore",
      "company_slug": "cmit",
      "role": "Full Stack Development Intern",
      "location": "Lahore, Pakistan",
      "start_date": "2026-07-01",
      "end_date": null,
      "is_current": true,
      "description": "...",
      "achievements": ["..."],
      "tech_stack": ["React", "Vite", "Supabase"]
    }
  ]
}
```

#### Get Current Position
```http
GET /api/experiences/current
```

#### Get Experience by Slug
```http
GET /api/experiences/:slug
```

#### Create/Update/Delete (Admin)
```http
POST /api/experiences
PUT /api/experiences/:id
DELETE /api/experiences/:id
X-API-Key: your_api_key
```

---

### Skills

#### Get All Skills
```http
GET /api/skills
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "JavaScript",
      "category": "language",
      "proficiency": 90,
      "icon": null,
      "color": null
    }
  ]
}
```

#### Get Skills by Category
```http
GET /api/skills/category/:category
```

**Categories:**
- `language` - Programming languages
- `framework` - Frameworks
- `tool` - Development tools
- `database` - Database technologies
- `other` - Other skills

**Example:**
```http
GET /api/skills/category/language
```

#### Create/Update/Delete (Admin)
```http
POST /api/skills
PUT /api/skills/:id
DELETE /api/skills/:id
X-API-Key: your_api_key
```

---

### Certifications

#### Get All Certifications
```http
GET /api/certifications
GET /api/certifications?lang=ur
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Introduction to JavaScript",
      "provider": "Great Learning",
      "certificate_type": "online",
      "issue_date": null,
      "expiry_date": null,
      "credential_url": null,
      "credential_id": null
    }
  ]
}
```

**Certificate Types:**
- `online` - Online courses
- `internship` - Internships
- `degree` - Academic degrees
- `other` - Other certifications

#### Create/Update/Delete (Admin)
```http
POST /api/certifications
PUT /api/certifications/:id
DELETE /api/certifications/:id
X-API-Key: your_api_key
```

---

### Profile

#### Get Profile Information
```http
GET /api/profile
GET /api/profile?lang=ar
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "full_name": "Wajahat Ali",
    "role": "Software Engineer & Developer",
    "bio": "I specialize in building scalable web...",
    "availability_status": "Available for opportunities",
    "email": "wajahat@example.com",
    "github_url": "https://github.com/Wajahat-Ali-Git",
    "linkedin_url": "https://www.linkedin.com/...",
    "profile_image_url": null,
    "resume_url": null
  }
}
```

#### Update Profile (Admin)
```http
PUT /api/profile
X-API-Key: your_api_key
Content-Type: application/json
```

**Body:**
```json
{
  "full_name": "Wajahat Ali",
  "role": "Senior Software Engineer",
  "bio": "Updated bio...",
  "email": "new@example.com"
}
```

---

### Tools

#### Get All Tools
```http
GET /api/tools
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "VS Code",
      "category": "editor",
      "icon": null,
      "website_url": null
    }
  ]
}
```

#### Get Tools by Category
```http
GET /api/tools/category/:category
```

**Categories:**
- `editor` - Code editors
- `database` - Database tools
- `api` - API testing tools
- `automation` - Automation tools
- `design` - Design tools
- `other` - Other tools

**Example:**
```http
GET /api/tools/category/editor
```

#### Create/Update/Delete (Admin)
```http
POST /api/tools
PUT /api/tools/:id
DELETE /api/tools/:id
X-API-Key: your_api_key
```

---

### GitHub

#### Get Cached Repositories
```http
GET /api/github/repos
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "repo_name": "CARSAGE",
      "repo_url": "https://github.com/...",
      "description": "Car recommendation app",
      "language": "JavaScript",
      "stars": 5,
      "forks": 2,
      "last_commit_message": "Update README",
      "last_commit_date": "2026-09-01T...",
      "fetched_at": "2026-09-09T..."
    }
  ]
}
```

#### Get GitHub Statistics
```http
GET /api/github/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total_repos": 25,
    "total_stars": 150,
    "total_forks": 30,
    "languages": ["JavaScript", "Python", "TypeScript"],
    "most_starred": { ... },
    "most_recent": { ... },
    "last_updated": "2026-09-09T..."
  }
}
```

#### Sync with GitHub API (Admin)
```http
POST /api/github/sync
X-API-Key: your_api_key
```

**Configuration Required:**
```env
GITHUB_USERNAME=Wajahat-Ali-Git
GITHUB_TOKEN=your_github_token
```

**Response:**
```json
{
  "success": true,
  "message": "Synced 25 repositories",
  "data": {
    "synced_count": 25,
    "repositories": ["repo1", "repo2", ...],
    "synced_at": "2026-09-09T..."
  }
}
```

---

## 🌍 Multi-Language Support

All endpoints support language-specific content via query parameter.

**Supported Languages:**
- `en` - English (default)
- `ur` - Urdu
- `hi` - Hindi
- `ar` - Arabic
- `fr` - French
- `de` - German

**Usage:**
```http
GET /api/projects?lang=ur
GET /api/profile?lang=hi
GET /api/certifications?lang=ar
```

**Fallback Behavior:**
- If requested language not available, falls back to English
- If English not available, returns original field value

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

### Common HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input or missing required fields
- `401 Unauthorized` - Missing or invalid API key
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry (e.g., slug already exists)
- `500 Internal Server Error` - Server error

### Example Error Responses

**Missing Required Fields:**
```json
{
  "success": false,
  "error": "Missing required fields: title, slug, description"
}
```

**Invalid Language:**
```json
{
  "success": false,
  "error": "Invalid language. Supported: en, ur, hi, ar, fr, de"
}
```

**Resource Not Found:**
```json
{
  "success": false,
  "error": "Project with slug \"invalid-slug\" not found"
}
```

**Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized: Invalid or missing API key"
}
```

---

## 🧪 Testing

### Automated Tests

```bash
# Test all API endpoints
node test-api-endpoints.js
```

**Coverage:**
- ✅ 19 endpoints tested
- ✅ Multi-language support verified
- ✅ Error handling validated
- ✅ 100% success rate

### Manual Testing with cURL

**Get all projects:**
```bash
curl http://localhost:5000/api/projects
```

**Get projects in Urdu:**
```bash
curl "http://localhost:5000/api/projects?lang=ur"
```

**Get featured projects:**
```bash
curl http://localhost:5000/api/projects/featured
```

**Get single project:**
```bash
curl http://localhost:5000/api/projects/carsage
```

**Create project (Admin):**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "title": "New Project",
    "slug": "new-project",
    "description": "Project description",
    "tech_stack": ["React", "Node.js"]
  }'
```

### Testing with Postman/Bruno

Import endpoints:
```
GET {{base_url}}/api/projects
GET {{base_url}}/api/experiences
GET {{base_url}}/api/skills
GET {{base_url}}/api/certifications
GET {{base_url}}/api/profile
GET {{base_url}}/api/tools
GET {{base_url}}/api/github/repos
```

---

## 📊 Database Schema

### Tables

- `projects` - Portfolio projects
- `experiences` - Work history
- `skills` - Technical skills
- `certifications` - Professional certifications
- `spoken_languages` - Language proficiency
- `personal_info` - Personal/hero section data
- `github_cache` - Cached GitHub repository data
- `tools` - Development tools

### Migrations

```bash
# Run migrations
npm run migrate:portfolio

# Seed with sample data
npm run seed

# Reset database
npm run db:fresh
```

---

## 🔧 Environment Variables

### Required Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database (choose one)
DATABASE_URL=postgresql://user:pass@localhost:5432/db
# OR
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Security
API_KEY=your_secure_api_key
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# GitHub (Optional)
GITHUB_USERNAME=Wajahat-Ali-Git
GITHUB_TOKEN=github_pat_xxx
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong API key
- [ ] Configure proper CORS origins
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure monitoring/logging
- [ ] Use HTTPS
- [ ] Set up CDN for static assets

### Environment-Specific Settings

**Development:**
- Verbose logging
- Lenient rate limits
- Debug mode enabled

**Production:**
- Minimal logging (errors only)
- Strict rate limits
- Debug mode disabled
- Security headers enabled

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are used for primary keys
- JSONB fields for flexible arrays (tech_stack, achievements)
- Automatic `created_at` and `updated_at` timestamps
- Soft deletes via `is_visible` flag

---

## 🤝 Support

For issues or questions:
- Check logs: `docker-compose logs -f` or `npm run dev`
- Test database: `npm run test-db`
- Verify tables: `node verify-tables.js`
- Test endpoints: `node test-api-endpoints.js`

---

**Last Updated:** 2026-09-09  
**Version:** 2.0.0  
**Maintainer:** Wajahat Ali (@Wajahat-Ali-Git)
