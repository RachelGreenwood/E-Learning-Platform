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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
