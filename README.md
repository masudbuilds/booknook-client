# BookNook – Client Application

A refined, community-driven online library platform inspired by editorial bookstore design. Built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Better Auth. BookNook allows readers to explore curated shelves, borrow titles with atomic real-time inventory management, contribute books to the community catalog, and track their active loans.

- **Live Client Application:** [https://booknook-client-roan.vercel.app/](https://booknook-client-roan.vercel.app/)
- **Live Backend API:** [https://booknook-server-rho.vercel.app/](https://booknook-server-rho.vercel.app/)
- **Backend Repository:** [booknook-server](../booknook-server)

---

## Key Features

- **Editorial Bookstore Aesthetics:** Thoughtfully designed palette with warm paper background (`#F7F4ED`), rich charcoal typography (`#292820`), refined gold accents (`#987A50`), stone borders (`#E5DED2`), and elegant serif headings.
- **Dynamic Catalog & New Arrivals:** Browse the complete collection with real-time category filtering (Fiction, Science, History, Kids, Others) and text search. The homepage showcases the 6 most recent additions dynamically from the production database.
- **Atomic Borrow & Return Engine:** Authenticated members can borrow books with automated return-date scheduling. Prevents duplicate active borrows for the same title and out-of-stock checkouts, while accurately restoring inventory upon return.
- **Member Contribution Dashboard:** Community members can add new titles via `/add-book` with instant cover previews (direct image URLs or ImgBB integration) and manage their contributed books via `/my-books` with full edit and delete controls.
- **Secure Authentication & Token Bridge:** Better Auth email/password authentication and optional Google OAuth, with persistent sessions, client-side route guards ([`ProtectedRoute`](src/components/ProtectedRoute.tsx)), and a dedicated `/api/auth/jwt` endpoint that issues signed Bearer tokens for backend API authorization.
- **Fully Responsive Layout:** Optimized and verified across mobile (375px, 425px), tablet (768px), laptop (1024px), and desktop (1440px) viewports with accessible drawers and modals.
- **Polished States & UX:** Includes skeleton loading states, editorial empty collection notices, toast feedback via React Hot Toast, and a custom literary 404 page.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15+ (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) with `@base-ui/react` (Nova preset)
- **Authentication:** [Better Auth](https://better-auth.com/) with MongoDB Adapter
- **Icons:** [Lucide React](https://lucide.dev/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm, yarn, or pnpm
- MongoDB Atlas cluster or running MongoDB instance
- BookNook Express backend server (or connect to the live backend URL)

### 1. Installation

```bash
cd booknook-client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Production Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Express backend API endpoint base URL | `https://booknook-server-rho.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Base URL of this client application | `https://booknook-client-roan.vercel.app` |
| `BETTER_AUTH_URL` | Better Auth server base URL | `https://booknook-client-roan.vercel.app` |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth sessions (minimum 32 characters) | *Your secure session secret* |
| `JWT_SECRET` | Shared secret key for signing API JWTs (must match server) | *Your shared JWT secret* |
| `MONGODB_URI` | MongoDB connection URI for Better Auth users and sessions | `mongodb+srv://...` |
| `MONGODB_DB_NAME` | MongoDB database name | `booknook` |
| `GOOGLE_CLIENT_ID` | *(Optional)* Google OAuth Client ID | `your-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | *(Optional)* Google OAuth Client Secret | *Your Google OAuth secret* |
| `NEXT_PUBLIC_IMGBB_API_KEY`| *(Optional)* ImgBB API key for uploading book covers | *Your ImgBB API key* |

> **Security Note:** Never commit `.env` to version control. The repository ignores `.env` files while providing `.env.example` as a template.

### 3. Google OAuth Setup (Optional)

If enabling Google Login:
1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/).
2. Add the following **Authorized JavaScript Origins**:
   - Production: `https://booknook-client-roan.vercel.app`
   - Local: `http://localhost:3000`
3. Add the following **Authorized Redirect URIs**:
   - Production: `https://booknook-client-roan.vercel.app/api/auth/callback/google`
   - Local: `http://localhost:3000/api/auth/callback/google`
4. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your environment.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build

```bash
npm run build
npm start
```

---

## Deployment on Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Root Directory to `booknook-client` (if working in a monorepo).
4. Add the required environment variables in the Vercel Project Settings:
   - `NEXT_PUBLIC_API_URL`: `https://booknook-server-rho.vercel.app`
   - `NEXT_PUBLIC_APP_URL`: `https://booknook-client-roan.vercel.app`
   - `BETTER_AUTH_URL`: `https://booknook-client-roan.vercel.app`
   - `BETTER_AUTH_SECRET`: *Your 32+ character session secret*
   - `JWT_SECRET`: *Must match `JWT_SECRET` on booknook-server*
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
   - `MONGODB_DB_NAME`: `booknook`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: *(Optional for Google login)*
5. Deploy.
