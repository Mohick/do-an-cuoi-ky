# 🎓 Graduation Project - Front-End

Welcome to the Front-End repository for the Graduation Project! This is a modern, responsive, and highly interactive Task & Group Management web application built with the latest front-end technologies.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) & [React Query](https://tanstack.com/query/latest)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Real-time Communication**: [Socket.io-client](https://socket.io/)
- **Animations**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

- `/src/components`: Reusable UI components.
- `/src/page`: Application pages and routing views (Auth, Dashboard, Group Management).
- `/src/hooks`: Custom React hooks (e.g., account management).
- `/src/socket`: Real-time WebSocket connection setup.
- `/src/ultils`: Utility functions and helpers.
- `router.tsx`: Application routing configuration.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm / bun

### Installation Steps

1. Navigate to the project directory:
   ```bash
   cd do-an-cuoi-ky-front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory based on your backend setup.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## ✨ Features
- **User Authentication**: Login, Sign-up, and Email Verification.
- **Dashboard**: Overview of projects and account management.
- **Group Management**: Create, join, leave, and manage member roles within groups.
- **Task Management**: Kanban-style task tracking (Waiting, Handling, Pending, Completed).
- **Real-time Updates**: Live synchronization using WebSockets.
