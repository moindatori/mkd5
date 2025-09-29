# Bulk Image SaaS

A full-stack application for bulk image generation with credit-based system.

## Features
- User authentication (Signup/Login)
- Credit-based image generation
- Admin panel for user management
- PostgreSQL database with Neon

## Setup Instructions

### Backend
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file from `.env.example`
4. Set up your Neon database and update `DATABASE_URL`
5. Add a strong `JWT_SECRET`
6. Run SQL tables creation script
7. Start server: `npm run dev`

### Frontend
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Database Setup
Run the following SQL in your Neon database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  credits INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE prompts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  prompt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
