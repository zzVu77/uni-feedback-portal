# Uni Feedback Portal

A comprehensive university feedback management system designed to bridge the communication gap between students and university departments. This monorepo contains both the backend API and the frontend user interface.

## 🚀 Features

- **User Roles**: Distinct roles for **Students**, **Department Staff**, and **Admins**.
- **Feedback Management**:
  - Submit feedback with categories, priority, and attachments.
  - Track feedback status (Pending, In Progress, Resolved, Rejected).
  - Forward feedback between departments.
  - Public vs. Private feedback visibility.
- **Community Forum**:
  - View public feedback as forum posts.
  - Upvote and comment on feedback.
  - Nested replies and comment reporting system.
- **Communication**:
  - **Clarification Conversations**: Private messaging channel between students and staff to clarify feedback details.
  - **Announcements**: System-wide news and updates.
- **Real-time Notifications**: Instant alerts for status updates, new comments, and assignments.
- **Administration**: Manage users, departments, categories, and reported content.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI (Primitives)
- **State/Data Fetching**: TanStack Query
- **Utilities**: Axios, date-fns, Zod

### Backend
- **Framework**: [NestJS 11](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.io
- **Authentication**: JWT & Refresh Tokens
- **Tools**: Docker, Swagger UI

## 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** (>=18.0.0)
- **npm** (>=8.0.0)
- **Docker** & **Docker Compose** (for the database)

## ⚡ Getting Started

### 1. Installation

Clone the repository and install dependencies for the entire monorepo:

```bash
git clone <repository-url>
cd uni-feedback-portal
npm install
```

### 2. Environment Setup

You will need to configure environment variables for both the backend and frontend.

- **Backend**: Create `backend/.env` (refer to `backend/.env.example` if available or the codebase).
- **Frontend**: Create `frontend/.env.local`.

### 3. Database Setup

Start the PostgreSQL database using Docker:

```bash
# Start the database container
npm run db:up --workspace=backend
```

Apply database migrations and seed initial data:

```bash
# Run migrations
npm run migration:deploy --workspace=backend

# Seed data (optional/if configured)
npm run db:seed --workspace=backend
```

### 4. Running the Application

You can run both the frontend and backend concurrently from the root directory:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001) (or your configured port)
- **Swagger Documentation**: [http://localhost:3001/api](http://localhost:3001/api) (typically)
- **Prisma Studio**: `npx prisma studio` (from `backend` directory)

## 📂 Project Structure

```
uni-feedback-portal/
├── backend/                # NestJS API application
│   ├── src/                # Source code
│   ├── prisma/             # Database schema and migrations
│   ├── db/                 # Docker compose and init scripts
│   └── ...
├── frontend/               # Next.js web application
│   ├── src/app/            # App router pages
│   ├── src/components/     # React components
│   ├── src/services/       # API integration
│   └── ...
├── package.json            # Root configuration & workspaces
└── ...
```

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the UNLICENSED license.
