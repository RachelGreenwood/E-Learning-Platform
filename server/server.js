import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const router = express.Router();

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}


function verifyJwt(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("No token provided");

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) return res.status(401).send("Invalid token");
      req.user = decoded;
      next();
    }
  );
}

router.post("/", verifyJwt, async (req, res) => {
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

async function saveProfile(role) {
  const token = await getAccessTokenSilently();

  await fetch("http://localhost:5000/api/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: user.email,
      username: user.username,
      discipline,
      role
    }),
  });
}

app.use("/api/profile", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
