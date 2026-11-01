# BookNook – Client Application

A warm, community-driven online library platform built with Next.js App Router, TypeScript, Tailwind CSS, and Better Auth. BookNook allows readers to browse curated shelves, borrow books with real-time copy tracking, add personal titles to the library catalog, and manage their borrowing history.

- **Live Client:** [https://booknook-client-roan.vercel.app/](https://booknook-client-roan.vercel.app/)
- **Live Backend API:** [https://booknook-server-rho.vercel.app/](https://booknook-server-rho.vercel.app/)
- **Backend Repository:** [booknook-server](../booknook-server)

---

## Key Features

- **Interactive Hero Carousel & New Arrivals:** Responsive Swiper-powered hero showcase with literary themes and live dynamic catalog previews highlighting the 6 newest library arrivals.
- **Complete Book Catalog & Filtering:** Searchable and filterable catalog by genres (Fiction, Science, History, Kids, Others) with instant inventory indicators and responsive grid layouts.
- **Atomic Borrow & Loan Management:** Authenticated readers can borrow available books with return-date selection, real-time inventory updates, duplicate active-loan prevention, and custom confirmation modals.
- **Member Book Contribution & Personal Shelf:** Dedicated `/add-book` form featuring direct URL previews and ImgBB image uploads, coupled with an interactive `/my-books` dashboard for editing and safely deleting contributed titles.
- **Secure Authentication & Token Bridge:** Better Auth email/password authentication with protected routes (`ProtectedRoute`), persistent sessions, and a secure `/api/auth/jwt` bridge issuing signed tokens for protected Express backend APIs.
- **Literary UI & Custom 404 Experience:** Warm cream (`#FDFBF7`), forest green (`#1C3F3A`), and terracotta (`#C86244`) design system with accessible shadcn/Base UI components, toast notifications, responsive mobile drawers, and a custom 404 page.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15+ (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) with `@base-ui/react` (Nova preset)
- **Authentication:** [Better Auth](https://better-auth.com/) with MongoDB Adapter
- **Icons:** [Lucide React](https://lucide.dev/)
- **Carousel:** [Swiper](https://swiperjs.com/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm, yarn, or pnpm
- Running MongoDB instance or MongoDB Atlas cluster
- Running BookNook Express backend server (or use the deployed backend URL)

### 1. Clone & Install Dependencies

```bash
cd booknook-client
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root of `booknook-client` (you can copy `.env.example`):

```bash
cp .env.example .env
```

Set the following environment variables:

| Variable | Description | Production Value / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Express backend API endpoint URL | `https://booknook-server-rho.vercel.app` *(or `http://localhost:5000`)* |
| `NEXT_PUBLIC_APP_URL` | Base URL of this client application | `https://booknook-client-roan.vercel.app` *(or `http://localhost:3000`)* |
| `BETTER_AUTH_URL` | Better Auth server base URL | `https://booknook-client-roan.vercel.app` *(or `http://localhost:3000`)* |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth sessions (min 32 chars) | `your_better_auth_secret` |
| `JWT_SECRET` | Shared secret for signing API JWTs (must match server) | `your_shared_jwt_secret` |
| `MONGODB_URI` | MongoDB connection URI for Better Auth users & sessions | `mongodb+srv://...` |
| `MONGODB_DB_NAME` | MongoDB database name | `booknook` |
| `GOOGLE_CLIENT_ID` | *(Optional)* Google OAuth Client ID | `your_google_client_id` |
| `GOOGLE_CLIENT_SECRET` | *(Optional)* Google OAuth Client Secret | `your_google_client_secret` |
| `NEXT_PUBLIC_IMGBB_API_KEY`| *(Optional)* ImgBB API key for uploading book covers | `your_imgbb_key` |

> **Note on Authentication:** Better Auth handles user registration and login with encrypted cookies. When protected Express API requests are needed, the client queries `/api/auth/jwt` directly to retrieve a short-lived Bearer token signed with the shared `JWT_SECRET`. Google OAuth is optional; if omitted, the app smoothly uses email/password authentication.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## Deployment on Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Root Directory to `booknook-client` if in a monorepo.
4. Add all environment variables listed above in the Vercel Project Settings:
   - `NEXT_PUBLIC_API_URL`: `https://booknook-server-rho.vercel.app`
   - `NEXT_PUBLIC_APP_URL`: `https://booknook-client-roan.vercel.app`
   - `BETTER_AUTH_URL`: `https://booknook-client-roan.vercel.app`
   - `BETTER_AUTH_SECRET`: your 32+ character session secret
   - `JWT_SECRET`: must match `JWT_SECRET` on `booknook-server`
   - `MONGODB_URI`: your MongoDB Atlas connection string
   - `MONGODB_DB_NAME`: `booknook`
5. Deploy.
