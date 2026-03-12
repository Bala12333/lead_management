# Gharpayy Lead Management System

A full-stack, Next.js Lead Management OS designed for 5-minute SLAs, cross-channel lead capture, and performance analytics.

## 🚀 Live Demo
**Production URL:** [https://lead-management-one-lac.vercel.app/](https://lead-management-one-lac.vercel.app/)

## ✨ Key Features
- **Centralized Lead Pipeline:** Captures leads dynamically from any source (WhatsApp, Forms, Direct).
- **5-Minute SLA Tracking:** Automatically calculates response time and flags SLA breaches in real-time.
- **Agent Ownership & Assignment:** Intelligent round-robin capabilities with manual override for clear accountability.
- **Interaction Logging:** Comprehensive timeline per lead (notes, follow-ups, system updates).
- **Automated Dashboard:** Real-time KPI metrics on total leads, breaches, avg response times, and visit conversions.
- **Visit Scheduling System:** Fully integrated property visit booking with status flows.
- **Lovable Light Aesthetic:** A modern, incredibly fast, strictly responsive UI built for data density.

## 🛠 Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Vanilla CSS (Lovable Light Theme)
- **Backend:** Next.js API Routes (Serverless)
- **Database:** PostgreSQL (Hosted on Supabase via Connection Pooling)
- **ORM:** Prisma Client

## 📦 Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Bala12333/lead_management.git
cd lead_management
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file referencing your local SQLite (or Supabase Postgres):
```env
DATABASE_URL="file:./dev.db"
```

4. **Initialize Database**
```bash
npx prisma db push
```

5. **Run the server**
```bash
npm run dev
```

## 🏗 System Architecture & Database Schema
- **Lead:** Tracks global lead info, SLA timestamps, assignments.
- **User (Agents):** System operators handling assigned follow-ups.
- **Interaction:** The polymorphic timeline events under each Lead.
- **Visit:** Property scheduling mapping directly to leads. 

Designed and implemented for exact operational tracking to prevent dropped leads across shared team channels.
