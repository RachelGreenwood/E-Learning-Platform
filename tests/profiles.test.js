// tests/profiles.test.js
import request from "supertest";
import express from "express";
import profilesRouter from "../server/server.js";
import pool from "../server/db.js";

// Mock JWT middleware
jest.mock("../server.js", () => {
  const originalModule = jest.requireActual("../server.js");
  return {
    ...originalModule,
    verifyJwt: (req, res, next) => {
      req.user = { sub: "auth0|testuser" }; // fake user
      next();
    },
  };
});

// Mock the database pool
jest.mock("../db.js", () => ({
  query: jest.fn(),
}));

describe("GET /api/profiles", () => {
  const app = express();
  app.use(express.json());
  app.get("/api/profiles", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM profiles ORDER BY id ASC");
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  });

  it("should return all profiles", async () => {
    // Arrange: mock the DB response
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, username: "Alice", email: "alice@example.com" },
        { id: 2, username: "Bob", email: "bob@example.com" },
      ],
    });

    // Act
    const res = await request(app).get("/api/profiles");

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, username: "Alice", email: "alice@example.com" },
      { id: 2, username: "Bob", email: "bob@example.com" },
    ]);
  });
});
