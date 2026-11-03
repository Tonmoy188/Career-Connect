# CareerConnect

> 🌐 **Live demo:** [ADD YOUR VERCEL LINK HERE](https://your-project.vercel.app)

CareerConnect is a full-stack job portal where companies can post openings and job seekers can browse, search and apply for them. It was built as my final assignment, using the MERN stack with JWT-based authentication.

Anyone can browse jobs without an account. Once registered, a user can apply for jobs, track the status of each application, publish their own job posts and review the people who applied to them.

---

## Features

**For job seekers**
- Browse all open jobs, search by title and filter by category
- Read the full job details, including requirements, salary and application deadline
- Apply with a cover letter, with duplicate applications blocked
- Track every application and its current status on the My Applications page
- View and update a personal profile (name, bio, skills)

**For employers**
- Create, edit and delete job posts with an optional application deadline
- See only the jobs you posted yourself
- Review everyone who applied to a job, with their skills and cover letter
- Move each application through Pending, Reviewed, Shortlisted, Accepted or Rejected

**General**
- Register, log in and log out with a JWT stored in the browser
- Protected pages that redirect to login when you are signed out
- Fully responsive layout, with a mobile menu
- Home, About and Contact pages, plus a shared header and footer

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router, Zustand, Axios, Lucide icons |
| Backend | Node.js, Express |
| Database | MongoDB Atlas with Mongoose |
| Auth | JSON Web Tokens, bcryptjs for password hashing |

---

## Project structure

```
career-connect/
├── src/                    # React frontend
│   ├── components/         # Header, Footer, JobCard, ReceivedApplications
│   ├── lib/                # Axios instance and API service
│   ├── store/              # Zustand auth store
│   ├── data/               # Static category list
│   └── App.jsx             # Pages and routes
├── public/
├── index.html
├── package.json
└── server/                 # Express backend
    ├── middleware/         # JWT authentication
    ├── models/             # User, Job, Application
    ├── routes/             # Auth, jobs and applications routes
    └── server.js
```

---

## Running it locally

You will need Node.js 18 or newer and a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

**1. Clone the repository**

```bash
git clone https://github.com/YOUR-USERNAME/career-connect.git
cd career-connect
```

**2. Set up the backend**

```bash
cd server
npm install
```

Create a file named `.env` inside `server/` (you can copy `.env.example`):

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=a_long_random_secret_string
CLIENT_URL=http://localhost:5173
```

Start it:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Visiting `/api/health` will tell you whether the database connected.

**3. Set up the frontend**

Open a second terminal in the project root (the folder that contains `src` and `server`):

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`. By default it talks to `http://localhost:5000/api`. To point it somewhere else, create a `.env` file in the project root with `VITE_API_URL=https://your-backend-url/api`.

---

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | server | MongoDB Atlas connection string |
| `JWT_SECRET` | server | Secret used to sign login tokens |
| `CLIENT_URL` | server | Frontend URL allowed by CORS |
| `PORT` | server | Port for the API (defaults to 5000) |
| `VITE_API_URL` | frontend | Base URL of the backend API |

---

## API overview

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in and receive a token |
| GET | `/api/auth/me` | Logged in | Get the current user |
| PATCH | `/api/auth/profile` | Logged in | Update profile |
| GET | `/api/jobs` | Public | List open jobs (supports `search`, `category`, `type`, `location`) |
| GET | `/api/jobs/:id` | Public | Single job details |
| POST | `/api/jobs` | Logged in | Create a job |
| PUT | `/api/jobs/:id` | Owner | Update a job |
| DELETE | `/api/jobs/:id` | Owner | Delete a job |
| POST | `/api/applications/:jobId` | Logged in | Apply for a job |
| GET | `/api/applications/my` | Logged in | Applications you submitted |
| GET | `/api/applications/received/:jobId` | Job owner | Applications for your job |
| PATCH | `/api/applications/:applicationId/status` | Job owner | Change an application's status |

---

## Notes

- Any registered user can both post jobs and apply to them. You cannot apply to your own job.
- The contact form is a front-end demo and does not send or store messages.
- The email, phone number and address shown on the Contact page and footer are placeholders.

---

## Author

**Tonmoy Bhowmik**

GitHub: https://github.com/Tonmoy188