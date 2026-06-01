# AIP Inc — Render Deployment Guide

This guide provides instructions on how to deploy the **AIP Inc** Next.js application to **Render**.

---

## 🚀 One-Click Deployment via Render Blueprint

This repository includes a `render.yaml` Blueprint file that automates the entire setup. Render will automatically read this file, set up the Web Service, pre-populate environment variables, and configure the launch commands.

### Step 1: Initialize Git and Push to GitHub/GitLab
If you haven't already, initialize a Git repository in the `aip-inc` project directory:
```bash
# Navigate to project directory
cd aip-inc

# Initialize git
git init

# Add all files (the ignored .env and database files will be skipped automatically)
git add .

# Create initial commit
git commit -m "chore: initial commit for deployment"

# Push to your private GitHub or GitLab repository
git remote add origin <your-git-repo-url>
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render
1. Go to the [Render Dashboard](https://dashboard.render.com).
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub/GitLab repository.
4. Render will automatically detect the `render.yaml` configuration.
5. Review the service name and environment variables.
6. Click **Apply** to deploy!

---

## 💾 Database Strategy Options

The application uses Prisma and is configured with SQLite by default. When hosting SQLite on Render, you have two primary options:

### Option A: Free Tier (Zero Cost - Ephemeral)
Render's Free Tier web services do not support persistent disks. 
- **How it works:** On every deployment or daily restart, Render spins up a fresh container. The start script will automatically run migrations and run the seed script on boot (`npx prisma migrate deploy && npx prisma db seed`).
- **Result:** The application will be **fully functional out-of-the-box** and populated with the default admin credentials and services. However, any new quote requests or database changes made through the admin panel will be reset when the container restarts.
- **Ideal for:** Demos, portfolio showcases, staging environments, and client sign-offs.

### Option B: Production (Persistent Disk - Highly Recommended)
Render allows you to mount a persistent disk (volume) for SQLite starting at just $1/month (requires a Starter plan or higher for the Web Service).
- **How it works:** A persistent SSD is attached to your container. The SQLite database file resides on this disk and persists indefinitely across restarts and redeployments.
- **Setup:**
  1. In `render.yaml`, uncomment the `disk` section:
     ```yaml
     disk:
       name: aip-db-disk
       mountPath: /data
       sizeGB: 1
     ```
  2. Change the `DATABASE_URL` environment variable value to:
     ```env
     DATABASE_URL="file:/data/dev.db"
     ```
  3. Deploy the blueprint. Render will provision the disk, attach it to `/data`, and your SQLite file will reside safely on the persistent drive.

### Option C: Cloud PostgreSQL (Neon / Supabase / Render Postgres)
If you prefer a standard serverless PostgreSQL database:
1. Provision a free PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. In `aip-inc/prisma/schema.prisma`, change the database datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` in your Render Environment Variables to your Postgres connection string (e.g. `postgresql://...`).
4. Re-push your changes to Git. Prisma will automatically handle the migration and seeding seamlessly.

---

## 🔑 Environment Variables Checklist

If you configure your service manually on Render (without using the Blueprint), make sure to set the following environment variables:

| Variable | Description | Recommended Production Value |
| :--- | :--- | :--- |
| `NODE_ENV` | Production mode flag | `production` |
| `DATABASE_URL` | SQLite database connection string | `file:./prisma/dev.db` (Free) or `file:/data/dev.db` (Disk) |
| `PORT` | Listening port for Next.js | `3000` |
| `AUTH_SECRET` | Secret key used to encrypt Auth cookies | A long, secure random string (e.g. 32+ characters) |
| `AUTH_URL` | The primary URL of your application | `https://your-app.onrender.com` |
| `ADMIN_EMAIL` | Default username for the admin dashboard | `admin@aipinc.com` |
| `ADMIN_PASSWORD` | Default password for the admin dashboard | Change this to a secure password |

---

## 🛠️ Verification & Maintenance

Once deployed:
- You can access the application at `https://your-app-name.onrender.com`.
- Access the Admin Dashboard at `https://your-app-name.onrender.com/admin` using your configured `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- If you need to rebuild or execute a shell inside the container, you can use Render's built-in SSH console or trigger a manual deploy with cache clearing from the dashboard.
