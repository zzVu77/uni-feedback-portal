# Uni Feedback Portal - Backend API

The backend for the University Feedback Portal is a robust, modular REST API built with **NestJS**. It handles all business logic, data persistence, real-time communications, and authentication for the platform.

## 🏗️ Architecture Overview

The application follows the **NestJS Modular Architecture**, ensuring separation of concerns and scalability. Each major domain feature is encapsulated within its own module.

### Core Technologies

- **Framework**: NestJS 11 (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma (Schema-first design)
- **Caching/Queue**: Redis (via Upstash)
- **Real-time**: Socket.io (Gateways)
- **Authentication**: JWT Strategy with Access & Refresh tokens

## 📂 Project Structure

The codebase is organized primarily within the `src/` directory:

```
backend/src/
├── config/             # Configuration & Environment Validation
├── modules/            # Feature-Specific Modules
├── shared/             # Shared Utilities & Helpers
├── types/              # Global Type Definitions
├── app.module.ts       # Root Application Module
└── main.ts             # Application Entry Point
```

## 🧩 Key Components & Modules

### 1. Business Modules (`src/modules/`)

These modules contain the core business logic (Controllers, Services, Providers).

- **`auth/`**: Handles user authentication (Login, Register, Refresh Token) and authorization guards.
- **`users/`**: User profile management, password updates, and role management.
- **`feedbacks/`**: Core logic for students creating and viewing their feedback.
- **`feedback_management/`**: Staff/Admin tools for processing, updating status, and forwarding feedback.
- **`departments/`**: Management of university departments (CRUD).
- **`categories/`**: Management of feedback categories.
- **`forum/`**: Handles public forum posts, upvoting logic, and public viewing.
- **`comment/`**: General comment system for forum posts and other entities.
- **`reports/`**: Logic for reporting inappropriate comments or content.
- **`moderation/`**: Admin/Staff tools for reviewing and resolving reported content.
- **`clarifications/`**: Private conversation system between students and staff regarding specific feedback.
- **`announcements/`**: System for creating and broadcasting university-wide news.
- **`dashboard/`**: Aggregates data for statistical charts and reports.
- **`notifications/`**: Manages creating and serving user notifications.

### 2. Infrastructure Modules

- **`prisma/`**: Provides the Prisma Client connection to the database.
- **`redis/`**: Handles connections to Redis for caching or session management.
- **`mail/`**: Service for sending email notifications (e.g., OTP, system alerts).
- **`uploads/`**: Handles file uploads (likely integrating with cloud storage or local file system).

### 3. Real-Time Communication

- **Socket.io Gateways**: Integrated within modules (like `notifications` or `clarifications`) to push real-time updates to connected clients.

### 4. Configuration (`src/config/`)

- **`env.validation.ts`**: Uses `zod` or `class-validator` to ensure all required environment variables are present and correct at startup.
- **`jwt.config.ts`**: Centralized JWT configuration.

## 🚀 Setup & Execution

### Prerequisites

- **Docker**: For running the PostgreSQL database.
- **Node.js**: LTS version recommended.

### Environment Variables

Ensure you have a `.env` file in the `backend/` root. Refer to `.env.example` or the `config/env.validation.ts` file for required keys (e.g., `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`).

### Running the App

```bash
# 1. Install dependencies
npm install

# 2. Start Database (Docker)
npm run db:up

# 3. Apply Migrations
npm run migration:deploy

# 4. Start Development Server
npm run dev
```

- **API Base URL**: `http://localhost:8080`
- **Swagger Documentation**: `http://localhost:8080/api`

## 🛠️ Database Management (Prisma)

See the [Database README](./db/README.md) for detailed instructions on migrations, seeding, and schema management.

```bash
# Common Commands
npx prisma studio       # Open database GUI
npx prisma generate     # Regenerate client after schema changes
```

<!-- ## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e
``` -->
