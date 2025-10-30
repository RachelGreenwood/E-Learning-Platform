# Kyu to Dan

## Link to Live Site
[Kyu to Dan](https://kyutodan.onrender.com/)

## Project Overview
This is a fullstack PERN (PostgreSQL, Express, React, Node.js) course management application for martial arts students with Auth0 authentication.

---

## Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) installed and running
- Auth0 account with an application set up for your project

---

## Backend Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/RachelGreenwood/E-Learning-Platform.git
   cd E-Learning-Platform/server```


2. **Install dependencies**

```npm install```


3. **Create a .env file in the server folder with the following variables:**

DATABASE_URL=<your_postgres_database_url>
PORT=<port_for_backend_server, e.g., 5000>
AUTH0_DOMAIN=<your_auth0_domain>
AUTH0_AUDIENCE=<your_auth0_audience>


4. **Start the backend server in development mode**

```npm run dev```


The server will start and listen on the port specified in your .env.

5. **(Optional) Seed the database**
If you have initial data to populate, run your seed script (if available) or manually insert data using psql or a database GUI.

## Frontend Setup

1. **Navigate to the frontend folder**

```cd ../client```


2. **Install dependencies**

```npm install```


3. **Create a .env file in the client folder with the following variables:**

VITE_AUTH0_DOMAIN=<your_auth0_domain>
VITE_AUTH0_CLIENT_ID=<your_auth0_client_id>
VITE_AUTH0_AUDIENCE=<your_auth0_audience>
VITE_API_URL=http://localhost:<backend_port>
VITE_AUTH0_REDIRECT_URI=http://localhost:5173


4. **Start the frontend in development mode**

```npm run dev````


The app should now be running at http://localhost:5173.

**Notes**

Make sure the backend is running before starting the frontend.

Adjust .env variables to match your Auth0 application and PostgreSQL setup.

For production deployment, set the appropriate environment variables in your hosting platform.

## Dependencies

### Backend Dependencies

| Dependency       | Purpose |
|-----------------|---------|
| `express`       | Framework for creating API endpoints and handling HTTP requests. |
| `pg`            | PostgreSQL client to connect and query the database. |
| `cors`          | Enables Cross-Origin Resource Sharing to allow frontend requests. |
| `dotenv`        | Loads environment variables from a `.env` file. |
| `jsonwebtoken`  | Verifies and decodes JWTs for authentication. |
| `jwks-rsa`      | Retrieves JSON Web Key Sets from Auth0 to validate tokens. |

**Dev Dependencies**

| Dependency | Purpose |
|------------|---------|
| `nodemon`  | Automatically restarts the server during development when files change. |

---

### Frontend Dependencies

| Dependency              | Purpose |
|------------------------|---------|
| `react`                | Core library for building the user interface. |
| `react-dom`            | Renders React components to the DOM. |
| `react-router-dom`     | Enables routing/navigation between pages in the React app. |
| `@auth0/auth0-react`  | Provides React hooks and components to integrate Auth0 authentication. |

**Dev Dependencies**

| Dependency                  | Purpose |
|------------------------------|---------|
| `vite`                       | Frontend development server and build tool. |
| `@vitejs/plugin-react`       | Adds React support to Vite. |
| `eslint`                     | Lints JavaScript and React code for quality and consistency. |
| `eslint-plugin-react-hooks`  | Lints React hook rules to prevent common mistakes. |
| `eslint-plugin-react-refresh`| Supports linting with Vite React Fast Refresh. |
| `@eslint/js`                 | Base ESLint configuration for JavaScript. |
| `@types/react`               | Type definitions for React (if using TypeScript). |
| `@types/react-dom`           | Type definitions for React DOM (if using TypeScript). |
| `globals`                    | Provides global variables definitions for ESLint. |

## Database Setup

This project uses a PostgreSQL database named `kyu_to_dan`. The main tables and their purpose are listed below:

### Tables

#### `profiles`
Stores information about users (students and instructors).

| Column      | Type    | Description                               |
|------------|--------|---------------------------------------------|
| `id`       | SERIAL | Primary key, unique ID for each user        |
| `auth0_id` | TEXT   | Auth0 identifier for authentication         |
| `email`    | TEXT   | User's email address                        |
| `username` | TEXT   | User's display name                         |
| `discipline` | TEXT | Martial arts discipline                     |
| `role`     | TEXT   | User role (`student` or `instructor`)       |

---

#### `courses`
Stores information about courses created by instructors.

| Column             | Type    | Description                                       |
|-------------------|--------|-----------------------------------------------------|
| `id`               | SERIAL | Primary key, unique ID for each course             |
| `name`             | TEXT   | Name of the course                                 |
| `credits`          | INT    | Number of credits the course is worth              |
| `prereqs`          | TEXT[] | Array of prerequisite course names                 |
| `students_allowed` | INT    | Maximum number of students allowed                 |
| `created_by`       | TEXT   | Auth0 ID of the instructor who created the course  |
| `enrolled_students`| INT    | Number of students currently enrolled              |

---

#### `user_courses`
Tracks which users have applied or enrolled in which courses.

| Column        | Type    | Description                                  |
|---------------|--------|-----------------------------------------------|
| `id`          | SERIAL | Primary key                                   |
| `user_id`     | TEXT   | Auth0 ID of the user                          |
| `course_id`   | INT    | ID of the associated course                   |
| `course_name` | TEXT   | Name of the course (redundant for convenience)|
| `teacher_name`| TEXT   | Name of the instructor                        |
| `prerequisites`| TEXT[]| Prerequisite courses for this enrollment      |
| `status`      | TEXT   | Status of the application (`applied` or `enrolled`) |

---

### Initial Setup Instructions
 
1. **Create the database**  
   ```sql
   CREATE DATABASE kyu_to_dan;

2. **Create Tables**

```CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  discipline TEXT,
  role TEXT
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  credits INT,
  prereqs TEXT[],
  students_allowed INT,
  created_by TEXT REFERENCES profiles(auth0_id),
  enrolled_students INT DEFAULT 0
);

CREATE TABLE user_courses (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES profiles(auth0_id),
  course_id INT REFERENCES courses(id),
  course_name TEXT,
  teacher_name TEXT,
  prerequisites TEXT[],
  status TEXT DEFAULT 'applied'
);```

## Database Dump

A PostgreSQL dump file `kyu_to_dan_dump.sql` is included for easy setup of the database.  
To restore the database:

```bash
createdb -U <your_postgres_username> kyu_to_dan
psql -U <your_postgres_username> -d kyu_to_dan -f kyu_to_dan_dump.sql

## Frontend Routes

This section documents the main routes in the React frontend and the components they render.

| Route Path                     | Component Rendered              | Description |
|--------------------------------|--------------------------------|-------------|
| `/`                            | `HomePage`                     | Landing page of the application |
| `/profile-setup`               | `ProfileSetup`                 | Form for new users to set up their profile |
| `/dashboard`                   | `Dashboard`                    | Main dashboard after login |
| `/profile`                     | `Profile`                      | View and edit user profile |
| `/user-search`                 | `SeeUsers`                     | Search and view other users (instructors/students) |
| `/create-course`               | `CreateCourse`                 | Form for instructors to create a new course |
| `/course-list`                 | `CoursesList`                  | List all available courses |
| `/course/:courseId`            | `Course`                       | View details for a specific course |
| `/enrolled-courses`            | `EnrolledCourses`              | View courses the user is enrolled in |
| `/handle-enrollment`           | `HandleEnrollments`            | Instructor view for managing course enrollment |
| `/handle-enrollment/:courseId` | `CourseEnrollments`            | Manage enrollments for a specific course |
| `/grades`                      | `Grades`                       | View grades for all courses relevant to the user |
| `/my-courses`                  | `MyCourses`                    | View courses the user has taken or is enrolled in |

## Authentication

This application uses **Auth0** for authentication. Users must log in to access most of the app’s features.  

### How It Works

1. **Login**
   - Users are redirected to Auth0 to authenticate.
   - Upon successful login, Auth0 issues a JSON Web Token (JWT) that is stored in the client.

2. **JWT Verification**
   - The frontend sends the JWT in the `Authorization` header for protected API requests.
   - Backend routes that require authentication use the `verifyJwt` middleware to validate the token.

3. **Protected Routes**
   The following backend API routes require a valid JWT:

   - `GET /api/profile` – Fetch logged-in user profile
   - `POST /api/profile` – Create a user profile
   - `PUT /api/profile` – Update user profile
   - `DELETE /api/profile` – Delete user profile
   - `POST /courses` – Create a course (instructors only)
   - `PUT /courses/:id` – Update course details (instructors only)
   - `POST /user-courses` – Apply for a course
   - `PUT /course-students/:courseId` – Enroll students in a course (instructors only)
   - `GET /user-courses` – Get courses applied/enrolled by a student
   - `GET /instructor-courses` – Get courses created by an instructor
   - `GET /course-students/:courseId` – Get students for a course
   - `GET /student-courses` – Instructor view of a student’s enrolled courses

4. **Frontend Protected Pages**
   - `/dashboard`
   - `/profile`
   - `/profile-setup`
   - `/create-course`
   - `/handle-enrollment`
   - `/enrolled-courses`
   - `/grades`
   - `/my-courses`

5. **Environment Variables**
   - Backend `.env`:
     ```env
     AUTH0_DOMAIN=<your_auth0_domain>
     AUTH0_AUDIENCE=<your_auth0_audience>
     ```
   - Frontend `.env`:
     ```env
     VITE_AUTH0_DOMAIN=<your_auth0_domain>
     VITE_AUTH0_CLIENT_ID=<your_auth0_client_id>
     VITE_AUTH0_AUDIENCE=<your_auth0_audience>
     VITE_AUTH0_REDIRECT_URI=http://localhost:5173
     ```

> **Note:** Users cannot access protected routes or pages without logging in via Auth0. Make sure your Auth0 application allows the redirect URI configured in your frontend `.env`.

## Tests

This project includes tests for both frontend and backend functionality using Vitest, React Testing Library, Jest, and Supertest.

### Frontend Test
- Tests `Profile.jsx`
- **Purpose:** Ensures that the Profile component correctly displays user information when authenticated.
- **Test Cases:**
  1. Shows the `username` and `email` fields when the user is authenticated and the fetch request succeeds.
  2. Displays an error message if fetching the profile data fails.

### Backend Test
- **Tests `GET /api/profiles` endpoint
- **Purpose:** Verifies that the backend returns all user profiles from the database.
- **Test Case:** Returns an array of user profiles with correct `id`, `username`, and `email` fields, and responds with a `200` status code.