import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import path from 'path';

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
    res.json(result.rows[0]);
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

// GET single course by ID
app.get("/courses/:courseId", verifyJwt, async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM courses WHERE id = $1", [courseId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// POST: User applies to a course
app.post("/user-courses", verifyJwt, async (req, res) => {
  try {
    const { course_id } = req.body;
    const user_id = req.user.sub;

    // Get the course info
    const courseQuery = await pool.query(
      "SELECT name, prereqs, created_by FROM courses WHERE id = $1",
      [course_id]
    );

    if (courseQuery.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = courseQuery.rows[0];

    // Get the teacher's name from their profile
    const teacherQuery = await pool.query(
      "SELECT username FROM profiles WHERE auth0_id = $1",
      [course.created_by]
    );

    const teacher_name =
      teacherQuery.rows.length > 0 ? teacherQuery.rows[0].username : "Unknown";

    let prereqsArray = [];
    if (Array.isArray(course.prereqs)) {
      prereqsArray = course.prereqs;
    } else if (typeof course.prereqs === "string" && course.prereqs.trim() !== "") {
      prereqsArray = [course.prereqs];
    }

    // Insert the course application
    const newApp = await pool.query(
      `INSERT INTO user_courses 
      (user_id, course_id, course_name, teacher_name, prerequisites)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [user_id, course_id, course.name, teacher_name, prereqsArray]
    );

    res.status(201).json(newApp.rows[0]);
  } catch (err) {
    console.error("Error applying to course:", err);

    // Error handling if user has already applied to the course
    if (err.code === "23505") {
      return res.status(400).json({ error: "Already applied to this course" });
    }

    res.status(500).json({ error: "Server error" });
  }
});

// GETs the courses a user has applied to
app.get("/user-courses", verifyJwt, async (req, res) => {
  try {
    const user_id = req.user.sub;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id query param" });
    }

    const result = await pool.query(
      `SELECT id, course_id, course_name, teacher_name, prerequisites, status
       FROM user_courses
       WHERE user_id = $1
       ORDER BY id DESC`,
      [user_id]
    );
    console.log(user_id);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user courses:", err);
    res.status(500).json({ error: "Server error fetching user courses" });
  }
});

// GET all courses created by an instructor
app.get("/instructor-courses", verifyJwt, async (req, res) => {
  try {
    const instructor_id = req.user.sub;

    const result = await pool.query(
      `SELECT id, name, credits, prereqs, students_allowed
       FROM courses
       WHERE created_by = $1
       ORDER BY id DESC`,
      [instructor_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching instructor courses:", err);
    res.status(500).json({ error: "Server error fetching instructor courses" });
  }
});

// GET all students who have applied to a course
app.get("/course-students/:courseId", verifyJwt, async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, uc.status
       FROM profiles u
       JOIN user_courses uc ON u.auth0_id = uc.user_id
       WHERE uc.course_id = $1`,
      [courseId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Server error fetching students" });
  }
});

// PUT: Enroll students in a course
app.put("/course-students/:courseId", verifyJwt, async (req, res) => {
  const { courseId } = req.params;
  const { studentIds } = req.body;

  try {
    await pool.query("BEGIN");

    const courseIdInt = parseInt(courseId);

    const updateStatusQuery = `
      UPDATE user_courses uc
      SET status = 'enrolled'
      FROM profiles p
      WHERE uc.user_id = p.auth0_id
        AND p.id = ANY($1::int[])
        AND uc.course_id = $2
        AND uc.status = 'applied'
      RETURNING uc.user_id;
    `;

    const result = await pool.query(updateStatusQuery, [studentIds, courseIdInt]);

    if (result.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ error: "No matching students found to enroll" });
    }

    // Increment enrolled_students count in courses table
    const incrementCountQuery = `
      UPDATE courses
      SET enrolled_students = enrolled_students + $1
      WHERE id = $2;
    `;
    await pool.query(incrementCountQuery, [result.rowCount, courseIdInt]);

    await pool.query("COMMIT");

    res.json({ message: "Students enrolled successfully", count: result.rowCount });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error enrolling students:", err);
    res.status(500).json({ error: "Server error enrolling students" });
  }
});

// Edits course details
app.put("/courses/:id", verifyJwt, async (req, res) => {
  const { id } = req.params;
  const { name, credits, prereqs, students_allowed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE courses SET name=$1, credits=$2, prereqs=$3, students_allowed=$4 WHERE id=$5 RETURNING *",
      [name, credits, prereqs, students_allowed, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating course:", err);
    res.status(500).json({ error: "Database update failed" });
  }
});

// backend route for instructors to fetch any student's courses
app.get("/student-courses", verifyJwt, async (req, res) => {
  try {
    const studentId = req.query.user_id;
    if (!studentId) return res.status(400).json({ error: "Missing user_id query param" });

    const result = await pool.query(
      `SELECT id, course_id, course_name, teacher_name, prerequisites, status
       FROM user_courses
       WHERE user_id = $1
       AND status = 'enrolled'
       ORDER BY id DESC`,
      [studentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching student courses:", err);
    res.status(500).json({ error: "Server error fetching student courses" });
  }
});

// DELETEs a course
app.delete("/courses/:courseId", verifyJwt, async (req, res) => {
  const { courseId } = req.params;
  const auth0Id = req.user.sub; // from verifyJwt

  try {
    // Check if course exists and belongs to this teacher
    const courseRes = await pool.query(
      "SELECT * FROM courses WHERE id = $1",
      [courseId]
    );

    if (courseRes.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course = courseRes.rows[0];

    if (course.created_by !== auth0Id) {
      return res.status(403).json({ error: "Not authorized to delete this course" });
    }

    // Delete the course
    await pool.query("DELETE FROM courses WHERE id = $1", [courseId]);

    // Optionally, delete related enrollments (user_courses)
    await pool.query("DELETE FROM user_courses WHERE course_id = $1", [courseId]);

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Error deleting course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Rmeoves student(s) from a course
app.delete("/course-students/:courseId", verifyJwt, async (req, res) => {
  const { courseId } = req.params;
  const { studentIds } = req.body;

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: "No student IDs provided" });
  }

  try {
    const query = `
      DELETE FROM user_courses
      WHERE course_id = $1 AND user_id = ANY($2::text[])
      RETURNING *;
    `;

    const result = await pool.query(query, [courseId, studentIds]);

    res.status(200).json({
      message: `${result.rowCount} student(s) removed from course`,
      deletedStudents: result.rows,
    });
  } catch (err) {
    console.error("Error deleting students from course:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POSTs student's grades
app.post("/grades", verifyJwt, async (req, res) => {
  const { courseId, studentId, assignmentName, grade } = req.body;

  if (!courseId || !studentId || !assignmentName || !grade) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const query = `
      INSERT INTO grades (course_id, student_id, assignment_name, grade)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [courseId, studentId, assignmentName, grade]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error inserting grade:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET grades
app.get("/grades/:studentId/:courseId", verifyJwt, async (req, res) => {
  const { studentId, courseId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM grades WHERE student_id = $1 AND course_id = $2 ORDER BY created_at DESC",
      [studentId, courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching grades:", err);
    res.status(500).json({ error: "Server error" });
  }
});

if (process.env.NODE_ENV === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Serve static files from the build/dist folder
  app.use(express.static(path.join(__dirname, 'dist')));

  // SPA catch-all for frontend routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
