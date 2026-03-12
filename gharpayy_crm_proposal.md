# Gharpayy CRM - Technical Proposal & Architecture

## Why Antigravity is the Best Fit
As an advanced agentic coding assistant, I am uniquely positioned to build this MVP rapidly and precisely according to your Non-Negotiables layered approach. I can synthesize complex requirements into working code while maintaining strict adherence to system laws (like zero lead loss and 5-minute SLA). I iterate quickly, validate assumptions, and can build a complete full-stack application end-to-end.

### Technical Expectations & Tools Needed
To fulfill this objective effectively, I expect:
1. **Clear Feedback**: Rapid review of the MVP to adjust assignment rules or pipeline stages.
2. **Execution Environment**: We will build the application locally in the `d:\lead managment` folder.
3. **Focus on Core Flows**: Focusing on the Non-Negotiable paths first so the baseline functions flawlessly.

**Tools I will use to build this:**
- **Framework**: Next.js (App Router) for a robust full-stack, cohesive codebase.
- **Database**: SQLite (via Prisma ORM) for rapid local development without complex database server setup. Easily migratable to PostgreSQL for production.
- **Styling**: Vanilla CSS with a strong focus on premium, modern aesthetics (glassmorphism, clean layouts, custom typography).

## System Architecture (MVP)
The MVP will follow a monolithic client-server architecture using Next.js, which is optimal for speed of delivery and ease of deployment.
- **Frontend**: React components rendered on the server/client interacting via built-in Next.js API routes.
- **Backend API**: Next.js Route Handlers exposing RESTful endpoints for Lead Capture, Updates, Assignment, and Dashboard metrics.
- **Data Layer**: Prisma ORM handling data validation, relationships, and queries against a SQLite database.
- **Automation Engine**: API-triggered checks and background job simulation (for the MVP context) to enforce the 5-minute SLA and follow-ups.

## Database Design
The schema will revolve around four core entities:
1. **User (Agent)**: Admin/Agent roles, workload capacity, availability status.
2. **Lead**: Captured details (name, phone, source), current `stage` (New Lead to Booked), SLA tracking timestamps, and assigned `ownerId`.
3. **Interaction (Activity Log)**: Belongs to a Lead. Types: System Note (Reassignments), User Message, Status Change. Ensures immutable conversation history.
4. **Visit**: Schedule property visits, linked to a Lead, capturing date, assigned staff, and outcome (Booked, Considering, Not Interested).

## Scaling for Production
To transition this MVP into a production system serving thousands of incoming leads:
1. **Database Migration**: Switch SQLite to a managed PostgreSQL cluster (e.g., AWS RDS or Supabase) for high concurrency and failover.
2. **Queueing System**: Implement a message broker (RabbitMQ or Redis/BullMQ) to handle incoming webhook payloads (WhatsApp API, Facebook Graph) ensuring *Zero Lead Loss* even under high traffic spikes.
3. **Dedicated Workers**: Move the SLA SLA monitoring and automatic round-robin assignment engine into dedicated background workers (Cron / Redis) rather than synchronous API requests.
4. **Official Integrations**: Integrate officially with Meta's Graph API for WhatsApp to handle two-way messaging directly inside the app rather than simulated inputs.
5. **Real-time Updates**: Utilize WebSockets for real-time dashboard updates and instant notifications to agents when a lead violates the 5-minute SLA.
