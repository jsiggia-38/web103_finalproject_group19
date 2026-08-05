# [College Football Scout Helper]

CodePath WEB103 Final Project

Designed and developed by: Lukman Adeyemi, Joseph Siggia and Maria Khan

🔗 Link to deployed app:

## About
An app that allows student football players to showcase their skills to scouts.


### ✅ Description and Purpose

College Football Scout Helper is a full-stack web application that helps college football clubs, intramural teams, and student players connect through a centralized scouting platform.

Student players verify their identity before creating a profile. The system then retrieves and automatically populates verified football information such as playing position, preferred foot, skill level, and performance statistics from a simulated player registry. Players can complete additional profile information such as their biography, profile image, and availability.

Team captains and coaches can browse player profiles, search for players based on specific criteria, maintain a scouting list, and invite promising players to team tryouts.

The goal of this application is to simplify player recruitment within a college environment by giving student athletes an opportunity to showcase their abilities while providing campus football teams with an efficient way to discover and recruit new talent.


### Inspiration

Many talented college students are interested in playing football but often do not know how to join a team or demonstrate their abilities to coaches. Likewise, college football clubs and intramural teams frequently rely on word-of-mouth, social media, or informal recommendations when recruiting players.

College Football Scout Helper was inspired by the idea of creating a dedicated scouting platform where student players can present their football experience and skills while allowing coaches and team captains to efficiently identify, evaluate, and recruit players who fit their team's needs.

## Tech Stack

Frontend:
React
React Router
JavaScript
HTML
CSS

Backend:

Node.js
Express.js
PostgreSQL
pg
dotenv
CORS

## Features

### ✅ Database Reset
The backend includes a database reset feature that restores the application to its default state with sample teams, coaches, players, and scouting records.


<img width="1920" height="1020" alt="Database" src="https://github.com/user-attachments/assets/38aa28fb-a212-442f-a259-2eba8a590240" />



### ✅ Home Page

Modern landing page introducing the platform and highlighting featured players, featured teams, and the player recruitment process.

<img src="./client/public/images/Homepage%20.gif"
     alt="Homepage Demo"
     width="900">




### ✅ Player Identity and Profile Verification (Custom 1)

Student players must verify their identity using their first name, last name, and date of birth before creating a football profile.

The application checks the submitted details against a pre-seeded demo player registry. When a match is found, the system automatically populates verified football information, including:

- Primary and secondary playing positions
- Preferred foot
- Skill level
- Class year
- Goals
- Assists
- Clean sheets
- Games played

Verified football fields are read-only and cannot be manually changed by the player. Players can still add personal information such as their profile image, biography, and availability.

This feature uses simulated verification records for demonstration purposes and is not connected to an official sports governing body.

<img src="./client/public/images/Player%20Verification%207.gif"
     alt="Player Verification Demo"
     width="900">


### ✅ Complete Player Registration

Verified football information is automatically locked after identity verification. Players only complete their account information, biography, profile image, and availability before creating their account.

<img src="./client/public/images/Player%20Complete%202.gif"
     alt="Player Verification Demo"
     width="900">


### ✅ Verified Student Player Profiles

Student players can create and manage a verified football profile after completing the player verification process.

Each profile combines verified football information retrieved from the demo player registry with player-provided information to create a trusted recruiting profile.

Players and recruiters can view:

- Verified player badge
- Profile image
- Biography
- Playing position
- Preferred foot
- Skill level
- Class year
- Career statistics
- Availability
- Team assignment
- Scouting status
- Recent tryout invitations

Verified football information remains locked to preserve data integrity, while players can update their biography, profile image, and availability.

<img width="1920" height="1018" alt="Player 1" src="https://github.com/user-attachments/assets/36cdca39-7e91-4d7c-af64-96c545ba91e5" />



### Browse Players (Search • Filter • Sort) (Custom 2)

Players can be searched, filtered, and sorted by:

Position
Skill Level
Availability
Class Year
Goals
Assists

browse-players.gif



### Team Profiles

View information about college football teams, including team name, division, captain, and current roster.


### Scout List

Team captains and coaches can save promising players to their personal scout list while keeping track of scouting progress through statuses such as Interested, Watching, Contacted, Tryout Invited, and Added to Team.


### Tryout Invitation Modal (Custom 3)
Captains and coaches can invite players to upcoming tryouts using a popup modal without leaving the current page. Invitations include the tryout date, location, and a personalized message.


[gif goes here]



### AI Assistant(Custom 4)
An AI assistant that helps the user accomplish their tasks.  


### Responsive User Interface
The application is fully responsive and optimized for desktop, tablet, and mobile devices.


## Recruitment Workflow

The application guides users through the complete college football recruitment process:

1. Player verifies identity.
2. Player completes profile registration.
3. Player profile becomes publicly searchable.
4. Coaches browse and filter players.
5. Coaches save players to their Scout List.
6. Coaches send tryout invitations.
7. Players monitor scouting status and invitations.

<img src="./client/public/images/recruitment-workflow.gif"
     width="900">

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions

Installation Instructions
1. Clone the repository
git clone <repository-url>
2. Navigate into the project folder
cd college-football-scout-helper
3. Install backend dependencies
cd server
npm install
4. Install frontend dependencies
cd ../client
npm install
5. Configure environment variables
Create a .env file inside the server directory and add your PostgreSQL database connection information.
6. Seed the database
npm run reset
7. Start the backend server
npm run dev
8. Start the frontend
cd ../client
npm run dev
9. Open the application
Visit the local development URL displayed in the terminal to begin using College Football Scout Helper.

