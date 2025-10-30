// tests/profiles.test.js
import request from 'supertest';
import express from 'express';
import pool from '../db.js'; // your mocked db

jest.mock('../db.js', () => ({
  query: jest.fn(),
}));

const app = express();
app.use(express.json());

app.get('/api/profiles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profiles ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

describe('GET /api/profiles', () => {
  it('Get the data of all users in the profiles table', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, username: 'Rachel', email: 'rachelgreenwood3301@gmail.com' },
        { id: 2, username: 'Test', email: 'test@yahoo.com' },
      ],
    });

    const res = await request(app).get('/api/profiles');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: 1, username: 'Rachel', email: 'rachelgreenwood3301@gmail.com' },
      { id: 2, username: 'Test', email: 'test@yahoo.com' },
    ]);
  });
});
