# Uni Feedback Portal - Frontend

The frontend application for the University Feedback Portal, built with **Next.js 15** and **Tailwind CSS**. It provides a responsive and intuitive interface for students, department staff, and administrators to interact with the feedback system.

## ✨ Key Features

### 👨‍🎓 Student Portal
- **Dashboard**: Overview of feedback history and status.
- **Feedback Submission**: Create new feedback with rich text, category selection, and file attachments.
- **Feedback Tracking**: Monitor the progress of submitted feedback in real-time.
- **Communication**: Engage in clarification conversations with department staff.
- **Profile Management**: Change password and manage settings.

### 🏢 Department Staff Portal
- **Feedback Management**: View and process feedback assigned to the department.
- **Clarification**: Request more information from students via private messaging.
- **Forwarding**: Transfer feedback to other relevant departments.
- **Announcements**: Create and manage department-wide announcements.
- **Statistics**: View basic analytics on feedback resolution.

### 🔑 Admin Portal
- **Category Management**: Define and manage feedback categories.
- **Moderation**: Review and manage reported comments in the forum.
- **System Dashboard**: High-level statistics and system health overview.
- **User/Department Management**: (Configuration-based management).

### 🌐 Shared Features
- **Community Forum**: Public feedback area where users can upvote, comment, and reply.
- **Real-time Notifications**: Toast alerts and notification center for system events.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management & Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Communication**: [Socket.io-client](https://socket.io/docs/v4/client-api/) for real-time updates
- **Rich Text Editor**: [SunEditor](https://github.com/JiHong88/SunEditor)

## 🏗️ Architecture & Component Interaction

The application follows a **modular, data-driven architecture**. Here is how the pieces fit together:

### 1. 🔄 Data Flow (The "Hook-Service" Pattern)
We separate UI components from data fetching logic to ensure maintainability.
1.  **UI Component** (e.g., `FeedbackList.tsx`) requests data via a **Custom Hook**.
2.  **Custom Hook** (e.g., `useFeedbacks`) wraps `useQuery` or `useMutation` from TanStack Query.
3.  **Service Layer** (e.g., `feedback-service.ts`) makes the actual Axios HTTP request to the Backend API.
4.  **Backend** returns data, which updates the React Query cache, automatically triggering a UI re-render.

### 2. 🌍 Global Context
-   **UserContext**: Wraps the entire application in `RootLayout`. It initializes user data from server-side cookies (`accessToken`) during the initial page load, ensuring authentication state is available instantly without client-side flickering.

### 3. 📂 Folder Structure Meaning

-   **`app/`**: Next.js App Router. Contains page definitions and layouts.
    -   `(layout)`: Pages sharing the main sidebar/header shell.
    -   `(unlayout)`: Auth pages (Login, Forgot Password).
-   **`components/`**: Feature-based React components.
    -   `ui/`: Reusable, atomic Shadcn UI primitives (Button, Input, etc.).
    -   `[feature]/`: Business-specific components (e.g., `feedback`, `forum`).
-   **`services/`**: The API interaction layer. Pure functions that use Axios to call backend endpoints (e.g., `auth-service.ts`, `feedback-service.ts`).
-   **`hooks/`**: Custom React hooks.
    -   `queries/`: TanStack Query wrappers for fetching data.
    -   `filters/`: Logic for handling complex UI filtering states.
-   **`types/`**: Centralized TypeScript interfaces and types, mirroring the backend Prisma schema and API responses.
-   **`config/`**: Global configurations, such as the `axiosConfig.ts` which handles base URLs and interceptors for auth tokens.
-   **`constants/`**: Immutable data like navigation links, status labels, and asset paths.
-   **`utils/`**: Helper functions, formatters (date, currency), and data mappers for transforming API responses into UI-friendly formats.
-   **`lib/`**: External library configurations (e.g., QueryProvider, custom toast configuration).

### 4. 🧩 Layout Composition
-   **RootLayout (`app/layout.tsx`)**: Sets up fonts, providers (`UserProvider`, `QueryProvider`), and global UI elements like the `Toaster`.

## 🚀 Getting Started

### 1. Installation
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

### 2. Configuration
Create a `.env.local` file in the `frontend` root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_BASE_URL=http://localhost:3001/api
```

### 3. Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Build
To create an optimized production build:
```bash
npm run build
npm run start
```

## 🧪 Coding Standards
- **TypeScript**: Strict type checking is enabled. Always define interfaces in `@/types`.
- **Component Pattern**: Use the `services -> hooks -> components` flow for data.
- **Styling**: Tailwind utility classes only. Avoid custom CSS unless absolutely necessary.
- **Separation of Concerns**: Keep business logic in services/hooks and UI in components.