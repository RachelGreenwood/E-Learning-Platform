import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWKS client to fetch Auth0 signing keys
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

// Helper to get signing key for JWT verification
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// JWT verification middleware
function verifyJwt(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ error: "Invalid token" });
      }
      req.user = decoded; // attach decoded JWT payload to request
      next();
    }
  );
}

// See if user profile already exists
app.get("/api/profile", verifyJwt, async (req, res) => {
  const auth0_id = req.user.sub;

  try {
    const result = await pool.query(
      `SELECT * FROM profiles WHERE auth0_id = $1`,
      [auth0_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ exists: false });
    }
    res.json({ exists: true, profile: result.rows[0] });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Routes
app.post("/api/profile", verifyJwt, async (req, res) => {
  const { email, username, discipline, role } = req.body;
  const auth0_id = req.user.sub;

  try {
    const result = await pool.query(
      `INSERT INTO profiles (auth0_id, email, username, discipline, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [auth0_id, email, username, discipline, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get the data of all users in the profiles table
app.get("/api/profiles", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM profiles ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update user profile (PUT replaces the entire record)
app.put("/api/profile", verifyJwt, async (req, res) => {
  const { email, username, discipline } = req.body;
  const auth0_id = req.user.sub;

  try {
    // Only update fields that can be changed
    const result = await pool.query(
      `UPDATE profiles
       SET email = $1, username = $2, discipline = $3
       WHERE auth0_id = $4
       RETURNING *`,
      [email, username, discipline, auth0_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    if (err.code === "23505") {
      res.status(400).json({ error: "Email or username already taken" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
});

// Deletes a user
app.delete("/api/profile", verifyJwt, async (req, res) => {
  try {
    const auth0Id = req.user.sub;

    const result = await pool.query(
      "DELETE FROM profiles WHERE auth0_id = $1 RETURNING *",
      [auth0Id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ error: "Server error deleting profile" });
  }
});

// Organizer can add an event
app.post("/courses", verifyJwt, async (req, res) => {
  try {
    const {
      name,
      credits,
      prereqs,
      students_allowed
    } = req.body;
    const created_by = req.user.sub;

    const newCourse = await pool.query(
      `INSERT INTO courses 
      (name, credits, prereqs, students_allowed, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, credits, prereqs, students_allowed, created_by]
    );

    res.json(newCourse.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all courses from courses table
app.get("/courses", verifyJwt, async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM courses`);
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
