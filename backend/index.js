import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const app = express();
app.use(cors());
app.use(express.json());

function authenticate(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Signup
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "INSERT INTO users(email,password,credits) VALUES($1,$2,$3) RETURNING id,email,credits",
      [email, hashed, 10]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  if (!result.rows.length) return res.status(400).json({ error: "No user found" });
  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Wrong password" });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, credits: user.credits });
});

// Deduct credit for image
app.post("/api/use-credit", authenticate, async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query(
    "UPDATE users SET credits=credits-1 WHERE id=$1 AND credits>0 RETURNING credits",
    [userId]
  );
  if (!result.rows.length) return res.status(400).json({ error: "No credits left" });
  res.json(result.rows[0]);
});

// Admin users list
app.get("/api/admin/users", authenticate, async (req, res) => {
  const users = await pool.query("SELECT id,email,credits FROM users ORDER BY id");
  res.json(users.rows);
});

// Admin add credits
app.post("/api/admin/add-credit", authenticate, async (req, res) => {
  const { userId, amount } = req.body;
  const updated = await pool.query(
    "UPDATE users SET credits=credits+$1 WHERE id=$2 RETURNING id,email,credits",
    [amount, userId]
  );
  res.json(updated.rows[0]);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Backend running on " + port));
