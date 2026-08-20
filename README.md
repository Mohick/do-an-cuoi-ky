# 🎓 Graduation Project - Back-End

Welcome to the Back-End repository for the Graduation Project! This API powers the Task & Group Management platform, handling data persistence, real-time communication, and authentication.

## 🚀 Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Caching**: [Redis](https://redis.io/)
- **Real-time Communication**: [Socket.io](https://socket.io/)
- **Authentication**: JWT & Bcrypt
- **File Uploads**: [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Project Structure

- `/src/controllers`: Request handlers and business logic.
- `/src/middleware`: Express middlewares (Auth, Validation, etc.).
- `/src/models`: Mongoose database schemas.
- `/src/third-party`: Integrations (MongoDB, Redis, Socket.io, Cloudinary).
- `/src/views`: Route definitions.
- `index.ts`: Application entry point.

## 🛠️ Setup & Installation

### Prerequisites
- [Bun](https://bun.sh/) installed on your system.
- MongoDB instance (local or Atlas).
- Redis server instance.

### Installation Steps

1. Navigate to the project directory:
   ```bash
   cd do-an-cuoi-ky-back-end
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory. You will need variables for:
   - MongoDB URI
   - Redis connection
   - JWT Secret
   - Cloudinary credentials
   - Client URLs for CORS (`CLI_URL`, `CLIENT_URL`, `PROD_CLIENT_URL`)
   - `PORT` (defaults to 3000)

4. Start the development server:
   ```bash
   bun run start:dev
   ```

## ✨ Core Functionality
- **RESTful API**: Endpoints for users, groups, and tasks.
- **Real-time Engine**: WebSocket connections for instant task updates.
- **Secure Authentication**: Encrypted passwords and JWT-based session management.
- **Media Management**: Avatar and file uploads processed via Multer and stored on Cloudinary.
- **Performance**: High-speed runtime using Bun and caching via Redis.
