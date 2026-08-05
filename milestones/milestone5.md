# Milestone 5

This document should be completed and submitted during **Unit 9** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

---

# Checklist

- [x] Deploy your project on Render
  - [x] Added the deployed project link to `README.md`
- [x] Updated the status of issues in the project board
- [x] Updated `README.md` and marked completed features with ✅
  - [x] Added GIF demonstrations for completed features *(To be added)*
- [x] Completed the Reflection section below
- [x] Completed the Final Project Feature Checklist
- [x] Recorded a complete walkthrough GIF of the application
  - [x] Added the walkthrough GIF below *(To be added)*

---

# Final Project Feature Checklist

## Baseline Features

### Backend

- [x] Express backend with React frontend
- [x] PostgreSQL database

Backend-specific features:

- [x] One-to-many relationship
- [x] Many-to-many relationship using a join table

REST API includes:

- [x] GET
- [x] POST
- [x] PATCH
- [x] DELETE

Users can:

- [x] View players
- [x] Create player profiles
- [x] Update player profiles
- [x] Delete player profiles

- [x] REST routes follow proper naming conventions
- [x] Database reset script (`npm run reset`)

### Frontend

- [x] React Router navigation
- [x] Dynamic frontend routes
- [x] Multiple redirects between pages
- [x] React components organized into Pages and reusable Components
- [x] Responsive UI
- [x] Dynamic backend API integration
- [x] Project deployed successfully on Render

- [x] The project includes dynamic routes for both frontend and backend apps
- [x] All user-facing pages and features work correctly in production

---

## Custom Features

- [x] Graceful error handling throughout the application
- [x] One-to-one database relationship (Player ↔ Player Statistics)
- [x] Many-to-many relationship through Scout List
- [x] Unique field within a join table
- [x] Custom non-RESTful API routes
  - [x] Player verification
  - [x] Available coaches
  - [x] Recruitment activity
  - [x] Scout List operations
- [x] Player filtering and sorting
- [x] Automatic data generation after successful player verification
- [x] Server-side validation before database updates
- [x] Team assignment validation
- [x] Authentication and authorization middleware

---

## Stretch Features

- [x] Protected routes requiring authentication
- [ ] GitHub OAuth with Passport.js
- [x] Restrict available user options dynamically based on user roles
- [ ] Loading spinner while pages load
- [x] Disable buttons and inputs during form submission
- [x] Disable buttons after successful submission
- [ ] Cloud image uploads
- [ ] Toast notifications

---

# Additional Features Implemented

These features go beyond the required rubric.

## Authentication

- ✅ JWT Authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based authorization (Player, Coach, Organizer)
- ✅ Protected React routes
- ✅ Player ownership protection when editing profiles

---

## Player Verification System

- ✅ Registry-based player verification
- ✅ Locked verified soccer information
- ✅ Prevent duplicate player registration
- ✅ Automatically populate verified player statistics
- ✅ Read-only registry information after verification

---

## Player Management

- ✅ Player profile creation
- ✅ Player profile editing
- ✅ Player profile deletion
- ✅ Dynamic player profile pages
- ✅ Recruitment activity dashboard
- ✅ Team assignment status

---

## Team Management

- ✅ Organizer dashboard
- ✅ Coach dashboard
- ✅ Team creation
- ✅ Coach assignment
- ✅ Team directory
- ✅ Team detail pages
- ✅ Practice schedule management
- ✅ Roster tracking

---

## Scouting System

- ✅ Browse verified players
- ✅ Add player to Scout List
- ✅ Remove player from Scout List
- ✅ Coach Scout List dashboard
- ✅ Duplicate scout prevention

---

## Recruitment Features

- ✅ Team creation workflow
- ✅ Team overview pages
- ✅ Recruitment dashboards
- ✅ Dynamic statistics
- ✅ Featured Players populated from the live database
- ✅ Featured Soccer Teams populated from the live database

---

## Deployment

- ✅ Backend deployed on Render
- ✅ Frontend deployed on Render
- ✅ PostgreSQL database hosted on Render
- ✅ Environment variables configured
- ✅ Production API integration
- ✅ React Router rewrite rules configured
- ✅ Production application fully functional

---

# Final Demo GIF

## Complete Application Walkthrough

> **Insert final walkthrough GIF here**

<!--
![Final Demo](gif-link-here.gif)
-->

---

# Reflection

## 1. What went well during this unit?

Our team successfully completed the development and deployment of the College Soccer Scout Helper application. We integrated a React frontend with an Express and PostgreSQL backend, implemented secure JWT authentication, developed role-based dashboards for players, coaches, and organizers, and deployed both the frontend and backend on Render. We also completed dynamic database integration, allowing live player and team information to appear throughout the application.

---

## 2. What were some challenges your group faced in this unit?

The biggest challenge was deploying the application to production. We encountered issues connecting the backend to the Render PostgreSQL database due to incorrect environment variable configuration, particularly the database host settings. We also resolved React Router refresh issues by configuring Render rewrite rules and ensured the frontend communicated correctly with the deployed backend using environment variables and CORS configuration.

---

## 3. What were some of the highlights or achievements that you are most proud of in this project?

The most rewarding achievement was transforming the application into a complete production-ready full-stack web application. Features such as player verification, secure authentication, team creation, scouting, protected dashboards, dynamic player and team listings, and successful cloud deployment demonstrated our ability to build a modern web application from start to finish. Successfully deploying the application and seeing live data retrieved from the production PostgreSQL database was a major accomplishment.

---

## 4. Reflecting on your web development journey so far, how have you grown since the beginning of the course?

Since the beginning of the course, I have grown significantly as a full-stack developer. I gained practical experience designing relational databases, building RESTful APIs with Express, developing React applications with reusable components, implementing authentication and authorization, integrating frontend and backend systems, and deploying production-ready applications using Render. I also strengthened my debugging, deployment, and problem-solving skills while resolving production issues involving PostgreSQL, environment variables, CORS, and React Router. This project has given me the confidence to design, build, deploy, and maintain complete full-stack web applications.
