<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Frontend Agent Rules

Additional rules specific to the Next.js frontend.

---

## 🔒 Security Rules

### Never Commit Secrets
- ❌ Never commit `.env.local` files
- ❌ Never commit API keys or tokens
- ✅ Always use `.env.local.example` with placeholders
- ✅ Use `NEXT_PUBLIC_` prefix only for truly public values

### Environment Variables
```env
# ✅ Public (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx  # Anonymous key only!

# ❌ Private (NEVER use NEXT_PUBLIC_ prefix for secrets!)
SUPABASE_SERVICE_ROLE_KEY=xxx      # Backend only!
API_SECRET_KEY=xxx                  # Backend only!
```

---

## 🎨 Component Guidelines

### File Structure
```typescript
// ✅ Good structure
'use client';  // Only if using hooks/interactivity

import { useState } from 'react';
import { ComponentProps } from './types';

export default function MyComponent({ prop1, prop2 }: ComponentProps) {
  // State and logic
  
  // Event handlers
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### TypeScript
```typescript
// ✅ Define prop types
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// ✅ Use proper typing
export default function Button({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

---

## 🎯 Next.js 16 Specifics

### App Router
- Use `src/app/` directory structure
- File-based routing
- `page.tsx` for routes
- `layout.tsx` for shared layouts
- Server components by default (add `'use client'` when needed)

### When to Use 'use client'
```typescript
// ✅ Need 'use client' when using:
- useState, useEffect, other React hooks
- Event handlers (onClick, onChange, etc.)
- Browser APIs (window, document)
- Third-party libraries that use hooks

// ✅ Don't need 'use client' for:
- Static content
- Server-side data fetching
- Layouts
- Simple presentational components
```

### Data Fetching
```typescript
// ✅ Server Component (default)
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store' // or 'force-cache'
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.content}</div>;
}

// ✅ Client Component
'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return <div>{data?.content}</div>;
}
```

---

## 🎨 Styling Guidelines

### Tailwind CSS v4
```tsx
// ✅ Use utility classes
<div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
  <h2 className="text-xl font-bold text-white">Title</h2>
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
    Click
  </button>
</div>

// ✅ Responsive design
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// ✅ Dark mode (if configured)
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

---

## 🔄 State Management

### Local State
```typescript
// ✅ Simple state
const [count, setCount] = useState(0);

// ✅ Complex state
const [formData, setFormData] = useState({
  name: '',
  email: '',
  message: ''
});

// ✅ Update complex state
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};
```

---

## 📝 Form Handling

### Contact Form Example
```typescript
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

---

## ⚡ Performance

### Image Optimization
```tsx
import Image from 'next/image';

// ✅ Use Next.js Image component
<Image
  src="/profile.jpg"
  alt="Profile"
  width={400}
  height={400}
  priority  // For above-fold images
/>
```

### Code Splitting
```tsx
// ✅ Dynamic imports
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
});
```

---

## ♿ Accessibility

```tsx
// ✅ Good accessibility
<button
  type="button"
  aria-label="Close dialog"
  onClick={handleClose}
>
  <CloseIcon />
</button>

<form onSubmit={handleSubmit}>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    name="email"
    required
    aria-required="true"
    aria-invalid={!!errors.email}
  />
  {errors.email && (
    <span role="alert" className="error">
      {errors.email}
    </span>
  )}
</form>
```

---

## 🚫 Common Mistakes to Avoid

```typescript
// ❌ Bad: Direct DOM manipulation
document.getElementById('myElement').textContent = 'Hello';

// ✅ Good: React state
const [text, setText] = useState('');

// ❌ Bad: Inline functions in JSX (creates new function each render)
<button onClick={() => console.log('click')}>Click</button>

// ✅ Good: Define handler outside
const handleClick = () => console.log('click');
<button onClick={handleClick}>Click</button>

// ❌ Bad: Missing dependencies in useEffect
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// ✅ Good: Include all dependencies
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## 📦 Project Structure

```
portfolio/
├── src/
│   ├── app/                # App router
│   │   ├── page.tsx       # Home page
│   │   ├── layout.tsx     # Root layout
│   │   ├── contact/       # Contact page
│   │   └── experience/    # Experience page
│   │
│   ├── components/        # Reusable components
│   │   ├── shared.ts     # Shared utilities
│   │   └── *.tsx         # Component files
│   │
│   ├── lib/              # Utilities
│   │   └── supabase.ts   # API client
│   │
│   ├── types/            # TypeScript types
│   │   └── types.ts
│   │
│   └── constants/        # Constants
│       └── constants.ts
│
├── public/               # Static assets
├── .env.local           # Local secrets (NOT in git)
├── .env.local.example   # Template (safe to commit)
└── next.config.ts       # Next.js config
```

---

## ✅ Pre-Commit Checklist

- [ ] No `.env.local` in commit
- [ ] No API keys or secrets in code
- [ ] TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Components are properly typed
- [ ] Forms have validation
- [ ] Loading states implemented
- [ ] Error handling in place
- [ ] Accessibility attributes added
- [ ] Tested on mobile/desktop
- [ ] No console.logs left behind

---

**See main [AGENTS.md](../AGENTS.md) for general project rules.**
