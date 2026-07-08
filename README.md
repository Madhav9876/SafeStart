# 🚀 SafeStart AI

A modern, full-stack web application built with **React** and **Vite** on the frontend, powered by **Vercel serverless functions** on the backend, with **Supabase** for secure data storage and resource management.

---

## ✨ Features

- **Fast Development**: Vite + React for rapid development and hot module reloading
- **Serverless Backend**: Vercel Functions for scalable, event-driven API routes
- **Secure Storage**: Supabase-backed database for report storage and resource data
- **Built-in Authentication**: Supabase Auth with Google OAuth support
- **Type-Safe**: Full TypeScript support across frontend and backend
- **Production-Ready**: Optimized build pipeline with ESLint and type checking

---

## 📁 Project Structure

```
SafeStart/
├── api/                    # Vercel serverless functions (backend)
├── public/                 # Static assets (copied as-is)
├── src/                    # React frontend application
├── .env.example            # Template for environment variables
├── vercel.json             # Vercel configuration (build, routing, headers)
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

**Architecture Note**: Frontend and backend are co-located in a single repository for seamless Vercel deployment. The `src/` folder contains browser code, while `api/` contains server-only logic.

---

## ⚙️ Environment Variables

### Frontend Variables (Browser-Exposed)
These are prefixed with `VITE_` and are accessible in the browser:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Backend Variables (Server-Only)
These are used only in `api/` and **never** exposed to the browser:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FULLSTACK_PROJECT_REF=your_project_ref
FULLSTACK_RESTORE_API_URL=your_restore_api_url
```

⚠️ **Critical**: `SUPABASE_SERVICE_ROLE_KEY` must **never** appear in `src/` files or as a `VITE_*` variable.

---

## 🛠️ Local Development

### Prerequisites
- Node.js 16+ and npm/yarn
- Vercel CLI (optional, for testing serverless functions locally)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Madhav9876/SafeStart.git
   cd SafeStart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Testing Serverless Functions (Optional)
To test Vercel Functions locally, install and run the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This starts both the Vite dev server and local Vercel Functions at `http://localhost:3000`.

---

## 📦 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with hot reloading |
| `npm run build` | Type-check and build optimized production assets |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

---

## 🚀 Deployment to Vercel

### Deployment Checklist

1. **Prepare the repository**
   - Ensure `.env.local` is in `.gitignore`
   - Remove `dist/` and `node_modules/` from version control
   - Push clean code to GitHub

2. **Connect to Vercel**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Choose "Vite" as the framework preset

3. **Configure Vercel Settings**
   - **Install Command**: `npm ci`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example` with actual values
   - Ensure secrets are properly scoped to Production/Preview/Development

5. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Frontend served from `dist/`, backend from `api/`

### Post-Deployment
If any secrets were previously committed or accidentally shared, **rotate them immediately** before making the repository public.

### Google OAuth Setup

Do not put the Google client secret in `.env.local`, Vercel, or any `VITE_*` variable. Configure it in Supabase instead:

1. In Google Cloud Console, add this Authorized redirect URI:
   ```text
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   ```
2. In Supabase, go to Authentication -> Providers -> Google.
3. Enable Google and paste the Google Client ID and Client Secret there.
4. In Supabase Authentication -> URL Configuration, set Site URL to your Vercel URL.
5. Add Redirect URLs for your deployed and local app:
   ```text
   https://your-vercel-domain.vercel.app/dashboard
   http://localhost:5173/dashboard
   ```

---

## 🔐 Security Best Practices

- ✅ Never commit `.env.local` or any `.env*` files with real values
- ✅ Use `.env.example` as a safe template with placeholder values
- ✅ Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only
- ✅ Rotate secrets if they've been exposed
- ✅ Review Vercel Project Settings for environment variable scoping
- ✅ Enable branch protection rules for main/production branches

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript + Vite |
| **Styling** | CSS (with modular architecture) |
| **Backend** | Vercel Functions |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Google OAuth |
| **Linting** | ESLint |
| **Deployment** | Vercel |

---

## 📖 Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Vercel Functions](https://vercel.com/docs/functions/serverless-functions)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

## 📝 License

This project is open source. Add license information here if applicable.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
- Create a feature branch (`git checkout -b feature/your-feature`)
- Commit your changes (`git commit -am 'Add new feature'`)
- Push to the branch (`git push origin feature/your-feature`)
- Open a Pull Request

---

## 💬 Questions or Issues?

If you encounter any issues or have questions, please open a GitHub issue or reach out to the maintainer.

---

**Made with ❤️ by Madhav9876**
