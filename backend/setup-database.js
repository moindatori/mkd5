import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function setupDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        credits INT DEFAULT 10,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create prompts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        prompt TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Database tables created successfully!');
    
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('📅 Database time:', result.rows[0].now);
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();
