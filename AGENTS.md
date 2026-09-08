# Agent Rules & Guidelines

This document provides guidelines for AI agents working on this portfolio project.

---

## 🔒 Security Rules (CRITICAL)

### 1. **ALWAYS Get User Approval Before Git Operations**

**CRITICAL RULE:**
- ❌ **NEVER commit or push code without explicit user review and approval**
- ❌ **NEVER run `git commit` or `git push` automatically**
- ✅ **ALWAYS prepare changes and wait for user confirmation**
- ✅ **ALWAYS show user what will be committed before proceeding**
- ✅ **ALWAYS ask "Should I commit and push these changes?" before git operations**

**Workflow:**
1. Create/modify files as requested
2. Show user summary of changes
3. Ask: "Should I commit these changes with message: [commit message]?"
4. Wait for user approval
5. Only then run `git add`, `git commit`, `git push`

**Example:**
```
Agent: I've created the following files:
- Backend/AGENTS.md
- Backend/QUICKSTART.md

Should I commit these changes with message:
"docs: add AGENTS.md and quick start guide"

Please confirm before I proceed with git operations.
```

### 2. **NEVER Commit Secrets to Git**

**Forbidden Actions:**
- ❌ Never commit files containing API keys, passwords, or tokens
- ❌ Never commit `.env` files with real credentials
- ❌ Never commit database passwords or connection strings
- ❌ Never commit private keys or certificates
- ❌ Never hardcode secrets in source code

**Required Actions:**
- ✅ Always use `.env` files for secrets (and ensure they're in `.gitignore`)
- ✅ Provide `.env.example` files with placeholder values
- ✅ Use environment variables for all sensitive data
- ✅ Check `.gitignore` includes common secret files before committing
- ✅ If a secret is accidentally committed, immediately:
  1. Remove it from git history
  2. Rotate/regenerate the exposed credentials
  3. Notify the user

**Files That Should NEVER Be Committed:**
```
.env
.env.local
.env.development.local
.env.production.local
*.key
*.pem
*.p12
*.pfx
config/secrets.js
credentials.json
```

### 2. **Security Best Practices**

- Always validate user input on both client and server
- Use prepared statements for database queries (SQL injection prevention)
- Implement rate limiting on API endpoints
- Enable CORS with specific origins (not wildcard `*`)
- Use HTTPS in production
- Keep dependencies updated (run `npm audit` regularly)
- Never expose stack traces in production
- Implement proper authentication and authorization
- Use security headers (Helmet.js)

---

## 📁 Project Structure

```
MyPortfolio/
├── Backend/              # Express.js API with Supabase/PostgreSQL
│   ├── src/             # API source code
│   ├── database/        # Database schemas and migrations
│   ├── .env             # Local secrets (NOT in git)
│   ├── .env.example     # Template (safe to commit)
│   └── docker-compose.yml
│
├── portfolio/           # Next.js 16 frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   └── lib/        # Utility functions
│   ├── .env.local      # Local secrets (NOT in git)
│   └── .env.local.example
│
└── README.md
```

---

## 🛠️ Technology Stack

### Backend
- **Framework:** Express.js
- **Database:** PostgreSQL 16 (Docker) or Supabase (Cloud)
- **ORM:** Supabase Client / node-postgres (pg)
- **Security:** Helmet, CORS, Rate Limiting
- **Container:** Docker + Docker Compose

### Frontend
- **Framework:** Next.js 16.x (App Router)
- **React:** v19.x
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React, React Icons

### Development
- **Node.js:** v20 LTS
- **Package Manager:** npm
- **Version Control:** Git + GitHub

---

## 🎯 Coding Standards

### JavaScript/TypeScript

**Style:**
- Use ES6+ features (arrow functions, destructuring, async/await)
- Prefer `const` over `let`, never use `var`
- Use meaningful variable names (no single letters except loops)
- Add comments for complex logic
- Keep functions small and single-purpose

**Example:**
```typescript
// ✅ Good
const getUserById = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return await database.users.findById(userId);
};

// ❌ Bad
function f(x) {
  var y = db.get(x)
  return y
}
```

### React/Next.js

**Component Rules:**
- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript for prop types
- Extract complex logic into custom hooks
- Use Next.js conventions (App Router, server components when appropriate)

**Example:**
```tsx
// ✅ Good
interface ContactFormProps {
  onSubmit: (data: ContactData) => void;
  isLoading?: boolean;
}

export default function ContactForm({ onSubmit, isLoading = false }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    message: ''
  });

  // Component logic...
  
  return (
    <form onSubmit={handleSubmit}>
      {/* JSX */}
    </form>
  );
}
```

### API Design

**RESTful Conventions:**
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Use meaningful endpoint names (nouns, not verbs)
- Return appropriate status codes
- Use consistent response formats

**Response Format:**
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Optional message",
  "error": null
}
```

**Error Format:**
```json
{
  "success": false,
  "error": "Descriptive error message",
  "code": "ERROR_CODE"
}
```

---

## 🔄 Git Workflow

### Branch Naming

```
main              # Production-ready code
dev               # Development branch
feature/*         # New features
fix/*             # Bug fixes
chore/*           # Maintenance tasks
docs/*            # Documentation updates
```

**Examples:**
- `feature/contact-form`
- `fix/api-rate-limiting`
- `chore/update-dependencies`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks
- `perf:` Performance improvements
- `ci:` CI/CD changes

**Examples:**
```
feat(contact): add email validation to contact form

fix(api): resolve rate limiting issue on contact endpoint

docs: update README with Docker setup instructions

chore(deps): update dependencies to latest versions
```

### Before Committing

**Checklist:**
- [ ] **USER HAS REVIEWED AND APPROVED THE CHANGES**
- [ ] Code follows style guidelines
- [ ] No secrets/credentials in code
- [ ] `.env` files are in `.gitignore`
- [ ] Code is tested locally
- [ ] No console.logs left in production code
- [ ] Dependencies are in correct package.json section
- [ ] Commit message follows conventions
- [ ] No sensitive data in commit history
- [ ] User has explicitly confirmed: "Yes, commit and push"

---

## 🧪 Testing Guidelines

### Backend Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test contact form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Test message"}'
```

### Frontend Testing

- Test forms with valid/invalid data
- Test responsive design on multiple screen sizes
- Test dark mode (if applicable)
- Test accessibility (keyboard navigation, screen readers)
- Test API integration

### Manual Testing Checklist

- [ ] All API endpoints return correct status codes
- [ ] Form validation works (client & server)
- [ ] Error messages are user-friendly
- [ ] Loading states are visible
- [ ] Success/error notifications work
- [ ] Database operations succeed
- [ ] Rate limiting works
- [ ] CORS is properly configured

---

## 📦 Dependencies Management

### Adding Dependencies

**Production dependencies:**
```bash
npm install package-name
```

**Development dependencies:**
```bash
npm install --save-dev package-name
```

### Dependency Guidelines

- ✅ Use well-maintained packages with active communities
- ✅ Check package bundle size before adding
- ✅ Review security advisories (`npm audit`)
- ✅ Keep dependencies up to date
- ❌ Avoid packages with known vulnerabilities
- ❌ Don't install unused dependencies

---

## 🐛 Error Handling

### Backend

```javascript
// ✅ Good error handling
try {
  const result = await database.query(sql);
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Database error:', error);
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
}
```

### Frontend

```typescript
// ✅ Good error handling
const [error, setError] = useState<string>('');

const handleSubmit = async (data: FormData) => {
  try {
    await api.submit(data);
    setSuccess(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  }
};
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Server
PORT=5000
NODE_ENV=development

# Security
API_KEY=xxx
CORS_ORIGIN=http://localhost:3001

# Optional
GITHUB_TOKEN=xxx
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

**Rules:**
- Use `NEXT_PUBLIC_` prefix for client-side variables in Next.js
- Never expose sensitive keys on client side
- Provide `.env.example` files with placeholders

---

## 📝 Documentation Standards

### Code Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Use debounce to prevent excessive API calls during typing
const debouncedSearch = debounce(handleSearch, 300);

// ❌ Bad: Obvious comment
// Set the user name
const userName = "John";
```

### Function Documentation

```typescript
/**
 * Submit contact form data to the backend API
 * @param data - Contact form data (name, email, message)
 * @returns Promise with submission result
 * @throws Error if submission fails or data is invalid
 */
async function submitContactForm(data: ContactFormData): Promise<ApiResponse> {
  // Implementation
}
```

### README Updates

When adding new features:
- Update relevant README files
- Add usage examples
- Document new environment variables
- Update setup instructions if needed

---

## 🚀 Deployment Guidelines

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] No console.logs in production
- [ ] Error tracking configured
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Health check endpoint working
- [ ] Monitoring/logging set up

### Environment-Specific Settings

**Development:**
- Verbose logging
- Hot reload enabled
- Debug mode on
- Local database

**Production:**
- Minimal logging (errors only)
- Optimized builds
- Debug mode off
- Production database
- CDN for static assets
- Monitoring enabled

---

## 📊 Performance Guidelines

### Frontend

- Optimize images (use Next.js Image component)
- Lazy load components when appropriate
- Minimize bundle size
- Use code splitting
- Implement proper caching
- Avoid unnecessary re-renders

### Backend

- Use database indexes
- Implement pagination for large datasets
- Cache frequently accessed data
- Use connection pooling
- Optimize database queries
- Enable gzip compression

---

## ♿ Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Provide alternative text for images
- Test with screen readers

---

## 🆘 When Things Go Wrong

### If Secrets Are Committed

1. **Immediately:**
   ```bash
   # Remove from git
   git rm --cached .env
   git commit -m "security: remove exposed credentials"
   git push --force
   ```

2. **Rotate credentials:**
   - Regenerate all exposed API keys
   - Update Supabase keys if exposed
   - Change database passwords
   - Update `.env` with new values

3. **Prevent future exposure:**
   - Verify `.gitignore` is correct
   - Add pre-commit hooks
   - Use git-secrets or similar tools

### If Build Fails

1. Check Node.js version (should be v20+)
2. Delete `node_modules` and reinstall
3. Check for TypeScript errors
4. Verify environment variables
5. Check logs for specific errors

### If Docker Issues

1. Check Docker is running
2. View logs: `docker-compose logs -f`
3. Restart services: `docker-compose restart`
4. Reset: `docker-compose down -v && docker-compose up`

---

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✅ Quick Reference

### Environment Files Status
```
.env                    ❌ NEVER commit
.env.local             ❌ NEVER commit
.env.example           ✅ Safe to commit
.env.docker            ✅ Safe to commit (uses placeholders)
docker-compose.yml     ✅ Safe to commit (uses env vars)
```

### Common Commands
```bash
# Backend
cd Backend
npm install              # Install dependencies
npm run dev             # Start development server
docker-compose up       # Start with Docker
make start              # Start with Makefile

# Frontend
cd portfolio
npm install             # Install dependencies
npm run dev            # Start development server

# Database
make db-shell          # Access PostgreSQL (Docker)
make db-backup         # Backup database
```

---

## 🤖 Instructions for AI Agents

### Git Operations Protocol

**YOU MUST FOLLOW THIS PROTOCOL FOR ALL GIT OPERATIONS:**

1. **After completing work:**
   ```
   ✅ Create/modify files as requested
   ✅ Test changes locally if possible
   ✅ Prepare commit message following conventions
   ```

2. **Before ANY git command:**
   ```
   ❌ DO NOT run: git add, git commit, git push
   ✅ DO show user summary of changes
   ✅ DO ask for explicit approval
   ✅ DO wait for user confirmation
   ```

3. **Request approval format:**
   ```
   I've completed the following changes:
   
   Files created/modified:
   - path/to/file1.ts
   - path/to/file2.tsx
   
   Proposed commit message:
   "feat(feature): description of changes"
   
   Would you like me to commit and push these changes?
   Please respond with "yes" to proceed or "no" to review first.
   ```

4. **Only after user confirms:**
   ```
   User: "yes" or "commit and push" or "go ahead"
   
   Then you may run:
   - git add [files]
   - git commit -m "[message]"
   - git push origin [branch]
   ```

5. **If user says no:**
   ```
   User: "no" or "wait" or "let me review"
   
   Response: "Understood. The changes are ready for your review. 
   Let me know when you'd like me to proceed with git operations."
   ```

### Emergency Exception

**ONLY exception to this rule:**
- If a secret has been accidentally committed to git
- In this case, immediately notify user and ask for permission to fix

### Remember

- 🔴 **User approval is MANDATORY before any git operation**
- 🔴 **No autonomous commits or pushes**
- 🔴 **No "helpful" automatic git operations**
- ✅ **Always ask, always wait, always confirm**

---

**Last Updated:** 2026-09-08  
**Maintainer:** Wajahat Ali (@Wajahat-Ali-Git)

---

**⚠️ CRITICAL REMINDER: NEVER commit or push without user's explicit approval! ⚠️**
