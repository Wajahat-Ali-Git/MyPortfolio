# Next.js Developer Portfolio

## Overview
This is a modern, responsive, and interactive personal developer portfolio built with Next.js, React, and TypeScript. It serves as a digital resume and showcases technical projects, professional experience, skills, certifications, and real-time GitHub activity. The portfolio features a multi-language support system, dark mode toggle, and smooth animations powered by Framer Motion.

## Table of Contents
- [Architecture & Structure](#architecture--structure)
- [Main Features](#main-features)
- [Prerequisites & Setup](#prerequisites--setup)
- [Configuration](#configuration)
- [API Integrations (GitHub)](#api-integrations-github)
- [Adding/Modifying Content](#addingmodifying-content)
- [Development Guidelines](#development-guidelines)
- [Testing & Build](#testing--build)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Architecture & Structure

The project follows a standard Next.js 14+ App Router architecture.

```text
portfolio/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── app/                # Next.js App Router (pages, layout, globals.css)
│   │   ├── components/     # Reusable React components (GitHubActivity, WorkflowAnimation, etc.)
│   │   └── experience/     # Additional routes/pages
│   ├── constants/          # Data layer (projects, experience, skills, translations)
│   └── lib/                # Utility functions and helpers
├── eslint.config.mjs       # ESLint configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

---

## Main Features

- **Multi-language Support**: Fully translated content (English, Urdu, Hindi, Arabic, French, German) with LTR and RTL support.
- **Dynamic Theming**: Seamless dark/light mode integration.
- **Real-time GitHub Activity**: Live feed of recent GitHub commits, pull requests, and repository creations.
- **Animated UI**: Smooth scroll animations, staggering elements, and micro-interactions powered by Framer Motion.
- **Content-Driven**: Easy to update projects, experience, and skills via a centralized constants file.
- **Responsive Design**: Mobile-first architecture using Tailwind CSS, ensuring a perfect layout on any device.

---

## Prerequisites & Setup

### Prerequisites
- Node.js (v18.17.0 or higher recommended)
- npm, yarn, pnpm, or bun

### Local Development Setup

1. **Clone the repository** (if not already local)
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **View the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser. The page will auto-reload as you make edits.

---

## Configuration

### Environment Variables
Currently, the portfolio operates entirely without private environment variables to simplify hosting and prevent rate-limiting issues for public visitors. 

- **GitHub API**: The application fetches public data directly from the GitHub REST API without requiring a Personal Access Token.
- **Hardcoded Settings**: Variables like the default theme or GitHub username (`Wajahat-Ali-Git`) are defined in the component logic or constants layer.

---

## API Integrations (GitHub)

The portfolio includes a `GitHubActivity` component (`src/app/components/GitHubActivity.tsx`) that integrates with the GitHub REST API to fetch recent activity.

### Integration Details
- **Endpoint**: `https://api.github.com/users/{username}/events/public?per_page=30`
- **Authentication**: No authentication required (fetches public events).
- **Caching**: Implements Next.js `revalidate: 300` (5 minutes) to avoid hitting rate limits.

### Supported Activity Types
The component parses the following GitHub event types:
1. **PushEvent**: Displays the latest commit message and branch.
2. **PullRequestEvent**: Displays PR status (Opened, Merged, etc.) and PR title.
3. **CreateEvent**: Displays repository or branch creation events.

### UI States Documented
- **Loading State**: Displays a skeletal shimmer UI (`animate-pulse`) while fetching events.
- **Empty State**: Renders a fallback "No recent activity found" UI if the user has no public events.
- **Error State**: Captures failed network requests or API limits, displaying an error message with a "Try again" refresh button.
- **Success State**: Displays a grid of up to 8 of the latest parsed events with contextual icons (Lucide React) and dynamic color mapping based on event type.

---

## Adding/Modifying Content

All portfolio content is centralized in the `src/constants/contants.ts` file. You do not need to modify React components to update your resume.

### Updating Projects
To add a new project, append an object to the `PROJECTS` array:
```typescript
{
  title: "My New Project",
  descKey: "new_project_desc", // Define this key in the TRANSLATIONS object
  tech: ["React", "TypeScript", "Tailwind"],
  link: "https://github.com/your-username/repo",
  featured: true,
  color: "teal",
}
```

### Updating Experience & Skills
- **Experience**: Add new roles to the `WORK_HISTORY` array. Make sure to define the respective string keys in the `TRANSLATIONS` dictionaries.
- **Skills**: Add or adjust items in the `SKILLS`, `TOOLS`, and `LANGUAGES` arrays.
- **Certifications**: Add items to the `CERTIFICATIONS` array.

---

## Development Guidelines

- **Component Structure**: Keep components modular. Use `src/app/components/` for reusable pieces of the UI (buttons, cards, layout wrappers).
- **Styling**: Use Tailwind CSS for all styling. Avoid custom CSS files unless strictly necessary (e.g., base global variables in `globals.css`).
- **Animations**: Use `framer-motion` for complex animations. For standard hover/focus states, prefer Tailwind utility classes (`transition-all duration-300`).
- **Type Safety**: The project uses TypeScript. Ensure interfaces and types are defined for any new props, API responses, or constant data.

---

## Testing & Build

### Linting
The project uses ESLint to enforce code quality.
```bash
npm run lint
```

### Testing Setup
Currently, there is no automated testing suite (e.g., Jest or Cypress) configured. 
- *Future Enhancement*: Consider adding Vitest and React Testing Library for component unit testing.

### Build for Production
To build the application for production:
```bash
npm run build
```
This command compiles the Next.js application into the `.next` folder.

To start the production build locally:
```bash
npm run start
```

---

## Deployment

The application is optimized for deployment on Vercel, the creators of Next.js.

### Deploying to Vercel
1. Push your code to a GitHub repository.
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New** > **Project** and import your repository.
4. Vercel will automatically detect that it is a Next.js project and configure the build settings (`npm run build`).
5. Click **Deploy**.

### CI/CD Workflows
Currently, Vercel provides automatic CI/CD on every push to the `main` branch. No custom GitHub Actions are required unless you plan to host elsewhere (e.g., AWS, DigitalOcean) or run automated testing pipelines in the future.

---

## Troubleshooting

- **GitHub Activity not loading**: If the activity feed fails to load, you may have hit the unauthenticated GitHub API rate limit (60 requests per hour per IP). Wait a few minutes or switch networks.
- **Styles not applying**: Ensure the class names are correctly spelled. If you added a new file outside of the `src` directory that contains Tailwind classes, make sure to add that path to your Tailwind configuration `content` array.
- **Hydration Errors**: Next.js hydration mismatches usually occur if browser extensions inject elements into the DOM, or if you use `window` objects without a `useEffect` or `typeof window !== 'undefined'` check.

---

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request.

When contributing, please ensure you update the `constants.ts` translation dictionaries if you are adding new text elements, ensuring the multi-language support remains intact.
