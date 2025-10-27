# Kyu to Dan

## Link to Live Site
[Kyu to Dan](https://kyutodan-frci.onrender.com/)

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
