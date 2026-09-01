# Daily Growth Platform V2

Full-stack daily placement preparation platform.

## Stack
Frontend: React + Vite + CSS
Backend: Node.js + Express
Database: MongoDB + Mongoose
Auth: JWT + bcrypt
AI: server-side provider adapter
Uploads: Multer
Charts: Recharts

## Features
- Register/login/logout
- Forgot/reset password API
- User dashboard
- Daily DSA
- Vocabulary + spelling + professional email + puzzle
- Aptitude + reasoning
- Basic/intermediate/advanced difficulty
- Company-style questions
- Timed fullscreen sessions
- Browser-side anti-cheating event detection
- Delayed answer/explanation release
- Reports and weak-topic analysis
- Admin question management
- Admin PDF upload
- AI question-generation endpoint
- AI coach/chatbot endpoint
- Daily streak
- API architecture ready for reminders/leaderboards

## Run

Requirements:
- Node.js 20+
- MongoDB 6+ or MongoDB Atlas
- VS Code

Backend:
cd server
npm install
copy .env.example .env
npm run dev

Frontend:
cd client
npm install
npm run dev

Open the Vite URL shown by the terminal.

Create an admin:
1. Register a normal account.
2. In MongoDB Compass change that user's role from "user" to "admin".
3. Login again.

AI:
Add an API key to server/.env and implement the provider adapter in
server/src/services/ai.service.js. The included default adapter is intentionally
a safe mock so the application works without an AI key.

Security:
This is an educational/project implementation. For production use HTTPS,
HttpOnly secure cookies, CSRF protection, rate limiting, validation, audit logs,
virus scanning for uploads, object storage, email provider, stronger proctoring,
and a real AI provider.
