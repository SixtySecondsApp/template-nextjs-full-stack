# Project: [Project Name] - README & Development Guide

This document is the single source of truth for all developers working on this project. It outlines the architecture, conventions, and workflow required to ensure our codebase is performant, maintainable, and scalable.

## 1. Philosophy

We build this project according to three core principles:
1.  **Performance First:** Every line of code must be written with its impact on user experience in mind. We leverage Server Components by default.
2.  **Developer Experience (DX):** Modern tooling and a clear workflow enable us to focus on delivering business logic.
3.  **Quality and Maintainability:** A strongly-typed, well-structured, and tested codebase is non-negotiable.

## 2. Getting Started

Ensure you have Node.js v18+ and `npm` installed.

1.  **Clone the repository**
    ```bash
    git clone [REPO_URL]
    cd [PROJECT_NAME]
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up environment variables**
    *   Copy the `.env.example` file to a new file named `.env.local`.
    *   Fill in the `DATABASE_URL` variable with the connection string for your PostgreSQL database (provided by Neon, Railway, or AWS RDS).

    ```bash
    cp .env.example .env.local
    ```

    **Contents of `.env.local` (DO NOT COMMIT):**
    ```
    # PostgreSQL database connection string
    DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
    ```

4.  **Apply database migrations**
    *   This command will read your `prisma/schema.prisma` file and apply any pending changes to your database.

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server**
    ```bash
    npm run dev
    ```

## 3. Architecture & Key Concepts

### A. Next.js: Our Frontend and Backend

We adopt a "full-stack Next.js" architecture. The framework handles both UI rendering and server-side logic. **There is no separate backend server (e.g., Express).**

*   **Server Components (`async function Page()`)**: Used for displaying content and reading data. They can call Prisma directly.
*   **Server Actions (`'use server'`)**: Used for data mutations (create, update, delete) initiated from the client. This is the preferred method for form submissions.
*   **Route Handlers (`app/api/`)**: Used to create traditional API endpoints when Server Actions are not suitable (e.g., for webhooks or a public API for third parties).

### B. Data Management with Prisma

Prisma is our ORM. The `prisma/schema.prisma` file is the **single source of truth** for our database schema.

1.  **Server-Side Data Access (Reads)**
    *   **Method:** Import a singleton instance of the Prisma client and use it directly within your Server Components.
    *   **Justification:** This is the simplest and most performant approach. The query is executed on the server at render time.

    ```tsx
    // lib/prisma.ts (Example singleton)
    import { PrismaClient } from '@prisma/client';
    export const prisma = new PrismaClient();

    // app/page.tsx (Server Component)
    import { prisma } from '@/lib/prisma';

    export default async function HomePage() {
      const posts = await prisma.post.findMany();
      // ... Rest of the JSX
    }
    ```

2.  **Data Mutations with Server Actions**
    *   **Method:** Create an async function with the `'use server'` directive, import it into a Client Component, and call it from a form or event handler.
    *   **Justification:** This eliminates the need to create API endpoints for every action. It is safer, simpler, and perfectly integrated with React.

    ```tsx
    // app/posts/actions.ts
    'use server';
    import { prisma } from '@/lib/prisma';
    import { revalidatePath } from 'next/cache';

    export async function createPost(formData: FormData) {
      const title = formData.get('title') as string;
      await prisma.post.create({ data: { title } });
      revalidatePath('/'); // Refreshes the data on the home page
    }

    // components/features/CreatePostForm.tsx (Client Component)
    'use client';
    import { createPost } from '@/app/posts/actions';

    export function CreatePostForm() {
      return (
        <form action={createPost}>
          <input type="text" name="title" />
          <button type="submit">Create Post</button>
        </form>
      );
    }
    ```

3.  **Client-Side Data with TanStack Query**
    *   **When to use it:** For rich, interactive client-side experiences (e.g., data tables with real-time filtering and sorting) that cannot be managed on the server alone.
    *   **Method:**
        1.  Create a **Route Handler** (`app/api/posts/route.ts`) that uses Prisma to expose the data.
        2.  Call this endpoint from a Client Component using the `useQuery` hook from TanStack Query.

### C. Folder Structure

```
/src
├── app/                  # Routes, including Route Handlers (API)
│   ├── (main)/
│   │   └── page.tsx
│   ├── api/
│   │   └── posts/
│   │       └── route.ts
│   └── layout.tsx
├── actions/              # Server Actions (mutation logic)
├── components/           # React components
│   ├── ui/               # Base UI components (from shadcn/ui)
│   └── features/         # Business-specific components
├── lib/                  # Utilities, helpers, Prisma instance
│   └── prisma.ts
├── prisma/               # Prisma configuration
│   ├── migrations/       # Database migration history
│   └── schema.prisma     # Your database schema
└── styles/
    └── globals.css
```

## 4. Development Workflow

(Identical to the standard company workflow)

1.  **Git Branches:** `main` is for production. Development happens on `feat/...` or `fix/...` branches.
2.  **Pull Requests (PRs):** All changes must go through a PR to `main`. Self-review is mandatory before requesting a review from others.
3.  **Environment Variables:** `DATABASE_URL` and other secrets are stored in `.env.local` (never committed) and in Vercel project settings for production.

## 5. Best Practices & Conventions

*   **Prisma Schema:** The `schema.prisma` file is the single source of truth. All changes to the database structure **must** start here.
*   **Migrations:** Use `npx prisma migrate dev` to evolve your database schema. Never modify the database manually.
*   **Typing:** The Prisma client (`@prisma/client`) is **fully-typed**. Use these types to ensure the safety of your database interactions.
*   **Performance:** Use Prisma's `.select()` method in queries to fetch only the fields you need.
*   **Security:** Never expose the Prisma client directly to the browser. All database access must occur via Server Components, Server Actions, or Route Handlers.

## 6. Useful Scripts

*   `npm run dev`: Runs the development server.
*   `npm run build`: Builds the application for production.
*   `npm run lint`: Runs ESLint to check code quality.
*   `npm run test`: Runs tests with Vitest.

### Prisma-Specific Scripts

*   `npx prisma migrate dev`: Creates a new migration and applies it to your development database. This is the main command you will use.
*   `npx prisma generate`: Updates the Prisma client (`@prisma/client`) after you modify `schema.prisma`. This is often run automatically by other Prisma commands.
*   `npx prisma studio`: Opens a local web interface to view and edit the data in your database. Extremely useful for debugging.
*   `npx prisma db push`: Synchronises your schema with the database without creating a migration file. Useful for rapid prototyping, but **should be avoided in production**.